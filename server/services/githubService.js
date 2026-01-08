// server/services/githubService.js

const { Octokit } = require('@octokit/rest');

function createOctokit(accessToken) {
  return new Octokit({ auth: accessToken });
}

// Get user's GitHub profile
async function getGitHubUser(accessToken) {
  const octokit = createOctokit(accessToken);
  const { data } = await octokit.users.getAuthenticated();
  return data;
}

// Get user's repositories
async function getUserRepos(accessToken, page = 1, perPage = 100) {
  const octokit = createOctokit(accessToken);
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    direction: 'desc',
    per_page: perPage,
    page,
  });
  return data;
}

// Get repository details
async function getRepoDetails(accessToken, owner, repo) {
  const octokit = createOctokit(accessToken);
  const { data } = await octokit.repos.get({ owner, repo });
  return data;
}

// Get file content
async function getFileContent(accessToken, owner, repo, path, branch = 'main') {
  const octokit = createOctokit(accessToken);
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    if (data.content) {
      return {
        content: Buffer.from(data.content, 'base64').toString('utf8'),
        sha: data.sha,
        size: data.size,
        name: data.name,
        path: data.path,
      };
    }
    return null;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

// Get directory contents
async function getDirectoryContents(
  accessToken,
  owner,
  repo,
  path = '',
  branch = 'main'
) {
  const octokit = createOctokit(accessToken);
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if (Array.isArray(data)) {
      return data.map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        sha: item.sha,
      }));
    }
    return [];
  } catch (error) {
    if (error.status === 404) return [];
    throw error;
  }
}

// Get repository tree (all files)
async function getRepoTree(accessToken, owner, repo, branch = 'main') {
  const octokit = createOctokit(accessToken);
  try {
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: 'true',
    });
    return data.tree;
  } catch (error) {
    if (branch === 'main') {
      try {
        const { data } = await octokit.git.getTree({
          owner,
          repo,
          tree_sha: 'master',
          recursive: 'true',
        });
        return data.tree;
      } catch (e) {
        return [];
      }
    }
    return [];
  }
}

// Get branches
async function getBranches(accessToken, owner, repo) {
  const octokit = createOctokit(accessToken);
  try {
    const { data } = await octokit.repos.listBranches({
      owner,
      repo,
      per_page: 100,
    });
    return data.map((b) => ({
      name: b.name,
      protected: b.protected,
    }));
  } catch (error) {
    return [];
  }
}

// Get open pull requests
async function getPullRequests(accessToken, owner, repo) {
  const octokit = createOctokit(accessToken);
  try {
    const { data } = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
      per_page: 10,
    });
    return data.map((pr) => ({
      number: pr.number,
      title: pr.title,
      author: pr.user?.login,
      branch: pr.head?.ref,
      targetBranch: pr.base?.ref,
      url: pr.html_url,
      createdAt: pr.created_at,
      draft: pr.draft,
    }));
  } catch (error) {
    return [];
  }
}

// Get open issues
async function getIssues(accessToken, owner, repo) {
  const octokit = createOctokit(accessToken);
  try {
    const { data } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      per_page: 20,
    });
    return data
      .filter((issue) => !issue.pull_request)
      .map((issue) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body?.substring(0, 200),
        author: issue.user?.login,
        labels: issue.labels?.map((l) => l.name) || [],
        url: issue.html_url,
        createdAt: issue.created_at,
      }));
  } catch (error) {
    return [];
  }
}

// Get recent commits
async function getRecentCommits(accessToken, owner, repo, count = 10) {
  const octokit = createOctokit(accessToken);
  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: count,
    });
    return data.map((commit) => ({
      sha: commit.sha.substring(0, 7),
      fullSha: commit.sha,
      message: commit.commit.message.split('\n')[0],
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url,
    }));
  } catch (error) {
    return [];
  }
}

// Get contributors
async function getContributors(accessToken, owner, repo) {
  const octokit = createOctokit(accessToken);
  try {
    const { data } = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: 10,
    });
    return data.map((c) => ({
      username: c.login,
      avatar: c.avatar_url,
      contributions: c.contributions,
    }));
  } catch (error) {
    return [];
  }
}

// Create a new repository
async function createRepo(accessToken, name, description, isPrivate = false) {
  const octokit = createOctokit(accessToken);
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name,
    description,
    private: isPrivate,
    auto_init: true,
  });
  return data;
}

// Create or update file in repo
async function createOrUpdateFile(
  accessToken,
  owner,
  repo,
  path,
  content,
  message,
  sha = null
) {
  const octokit = createOctokit(accessToken);
  const params = {
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
  };
  if (sha) params.sha = sha;

  const { data } = await octokit.repos.createOrUpdateFileContents(params);
  return data;
}

// Detect deploy platform from files
async function detectDeployPlatform(accessToken, owner, repo, tree) {
  const paths = tree.map((f) => f.path.toLowerCase());

  // Check for platform-specific files
  if (paths.some((p) => p === 'vercel.json' || p.includes('.vercel'))) {
    return { platform: 'vercel', detected: true };
  }
  if (paths.some((p) => p === 'netlify.toml' || p.includes('netlify'))) {
    return { platform: 'netlify', detected: true };
  }
  if (paths.some((p) => p === 'railway.json' || p === 'railway.toml')) {
    return { platform: 'railway', detected: true };
  }
  if (paths.some((p) => p === 'render.yaml')) {
    return { platform: 'render', detected: true };
  }
  if (paths.some((p) => p === 'fly.toml')) {
    return { platform: 'fly', detected: true };
  }
  if (paths.some((p) => p === 'heroku.yml' || p === 'procfile')) {
    return { platform: 'heroku', detected: true };
  }
  if (paths.some((p) => p === 'app.yaml' || p === 'app.yml')) {
    return { platform: 'gcp', detected: true };
  }
  if (paths.some((p) => p.includes('amplify'))) {
    return { platform: 'aws-amplify', detected: true };
  }

  return { platform: null, detected: false };
}

// Analyze code quality
function analyzeCodeQuality(tree, paths, packageData) {
  const quality = {
    score: 0,
    grade: 'N/A',
    details: {
      hasLinting: false,
      hasFormatting: false,
      hasTypeScript: false,
      hasErrorHandling: false,
      hasLogging: false,
      hasValidation: false,
      hasSecurityHeaders: false,
      hasRateLimiting: false,
      hasCaching: false,
      hasCompression: false,
    },
    recommendations: [],
  };

  let points = 0;
  const maxPoints = 100;

  // Check for linting (10 points)
  if (
    paths.some((p) => p.includes('eslint') || p.includes('.eslintrc')) ||
    packageData?.devDependencies?.eslint
  ) {
    quality.details.hasLinting = true;
    points += 10;
  } else {
    quality.recommendations.push('Add ESLint for code consistency');
  }

  // Check for formatting (10 points)
  if (
    paths.some((p) => p.includes('prettier') || p.includes('.prettierrc')) ||
    packageData?.devDependencies?.prettier
  ) {
    quality.details.hasFormatting = true;
    points += 10;
  } else {
    quality.recommendations.push('Add Prettier for consistent formatting');
  }

  // Check for TypeScript (15 points)
  if (
    paths.some(
      (p) => p.endsWith('.ts') || p.endsWith('.tsx') || p === 'tsconfig.json'
    ) ||
    packageData?.devDependencies?.typescript
  ) {
    quality.details.hasTypeScript = true;
    points += 15;
  } else {
    quality.recommendations.push('Consider TypeScript for type safety');
  }

  // Check for error handling patterns (10 points)
  if (
    paths.some(
      (p) =>
        p.includes('error') ||
        p.includes('exception') ||
        p.includes('errorhandler')
    )
  ) {
    quality.details.hasErrorHandling = true;
    points += 10;
  } else {
    quality.recommendations.push('Add centralized error handling');
  }

  // Check for logging (10 points)
  const allDeps = {
    ...packageData?.dependencies,
    ...packageData?.devDependencies,
  };
  if (
    allDeps?.winston ||
    allDeps?.pino ||
    allDeps?.morgan ||
    allDeps?.bunyan ||
    paths.some((p) => p.includes('logger'))
  ) {
    quality.details.hasLogging = true;
    points += 10;
  } else {
    quality.recommendations.push('Add proper logging (Winston or Pino)');
  }

  // Check for validation (10 points)
  if (
    allDeps?.joi ||
    allDeps?.zod ||
    allDeps?.yup ||
    allDeps?.['express-validator']
  ) {
    quality.details.hasValidation = true;
    points += 10;
  } else {
    quality.recommendations.push('Add input validation (Zod or Joi)');
  }

  // Check for security (10 points)
  if (allDeps?.helmet || paths.some((p) => p.includes('security'))) {
    quality.details.hasSecurityHeaders = true;
    points += 10;
  } else {
    quality.recommendations.push('Add Helmet for security headers');
  }

  // Check for rate limiting (10 points)
  if (allDeps?.['express-rate-limit'] || allDeps?.['rate-limiter-flexible']) {
    quality.details.hasRateLimiting = true;
    points += 10;
  } else {
    quality.recommendations.push('Add rate limiting for API protection');
  }

  // Check for caching (5 points)
  if (allDeps?.redis || allDeps?.['node-cache'] || allDeps?.memcached) {
    quality.details.hasCaching = true;
    points += 5;
  }

  // Check for compression (5 points)
  if (allDeps?.compression) {
    quality.details.hasCompression = true;
    points += 5;
  }

  // Calculate score and grade
  quality.score = Math.round((points / maxPoints) * 100);

  if (quality.score >= 90) quality.grade = 'A+';
  else if (quality.score >= 80) quality.grade = 'A';
  else if (quality.score >= 70) quality.grade = 'B';
  else if (quality.score >= 60) quality.grade = 'C';
  else if (quality.score >= 50) quality.grade = 'D';
  else quality.grade = 'F';

  return quality;
}

// Detect design patterns
function detectDesignPatterns(paths, packageData, fileContents = {}) {
  const patterns = {
    primary: 'mixed',
    patterns: [],
    description: '',
  };

  const allDeps = {
    ...packageData?.dependencies,
    ...packageData?.devDependencies,
  };
  let oopIndicators = 0;
  let functionalIndicators = 0;

  // OOP indicators
  if (
    paths.some(
      (p) => p.includes('class') || p.includes('model') || p.includes('entity')
    )
  ) {
    oopIndicators += 2;
  }
  if (
    allDeps?.['class-validator'] ||
    allDeps?.['class-transformer'] ||
    allDeps?.typeorm ||
    allDeps?.sequelize
  ) {
    oopIndicators += 2;
    patterns.patterns.push('Active Record / Data Mapper');
  }
  if (allDeps?.nestjs || allDeps?.['@nestjs/core']) {
    oopIndicators += 3;
    patterns.patterns.push('Dependency Injection');
    patterns.patterns.push('Decorator Pattern');
  }
  if (paths.some((p) => p.includes('factory') || p.includes('builder'))) {
    oopIndicators += 1;
    patterns.patterns.push('Factory/Builder Pattern');
  }
  if (paths.some((p) => p.includes('singleton'))) {
    oopIndicators += 1;
    patterns.patterns.push('Singleton Pattern');
  }

  // Functional indicators
  if (allDeps?.ramda || allDeps?.lodash || allDeps?.['lodash/fp']) {
    functionalIndicators += 2;
    patterns.patterns.push('Utility-First Functions');
  }
  if (allDeps?.rxjs || allDeps?.['@reactivex/rxjs']) {
    functionalIndicators += 2;
    patterns.patterns.push('Reactive Programming');
  }
  if (allDeps?.immer || allDeps?.immutable) {
    functionalIndicators += 1;
    patterns.patterns.push('Immutable Data');
  }
  if (paths.some((p) => p.includes('hook') || p.includes('use'))) {
    functionalIndicators += 1;
    patterns.patterns.push('Hooks Pattern');
  }
  if (allDeps?.redux || allDeps?.zustand || allDeps?.recoil) {
    functionalIndicators += 1;
    patterns.patterns.push('State Management (Flux/Redux)');
  }

  // Common patterns
  if (paths.some((p) => p.includes('middleware'))) {
    patterns.patterns.push('Middleware Pattern');
  }
  if (
    paths.some(
      (p) =>
        p.includes('observer') || p.includes('event') || p.includes('listener')
    )
  ) {
    patterns.patterns.push('Observer/Event Pattern');
  }
  if (paths.some((p) => p.includes('repository') || p.includes('repo'))) {
    patterns.patterns.push('Repository Pattern');
  }
  if (paths.some((p) => p.includes('service') && p.includes('controller'))) {
    patterns.patterns.push('Service Layer Pattern');
  }
  if (paths.some((p) => p.includes('dto') || p.includes('vo'))) {
    patterns.patterns.push('DTO/Value Objects');
  }
  if (paths.some((p) => p.includes('adapter') || p.includes('wrapper'))) {
    patterns.patterns.push('Adapter Pattern');
  }
  if (paths.some((p) => p.includes('strategy'))) {
    patterns.patterns.push('Strategy Pattern');
  }
  if (paths.some((p) => p.includes('composite'))) {
    patterns.patterns.push('Composite Pattern');
  }

  // Determine primary paradigm
  if (oopIndicators > functionalIndicators + 2) {
    patterns.primary = 'object-oriented';
    patterns.description =
      'This codebase follows Object-Oriented Programming principles with classes, inheritance, and encapsulation. Code is organized around objects that contain both data and behavior.';
  } else if (functionalIndicators > oopIndicators + 2) {
    patterns.primary = 'functional';
    patterns.description =
      'This codebase embraces Functional Programming with pure functions, immutability, and composition. Side effects are minimized and data transformations are preferred over mutations.';
  } else if (oopIndicators === 0 && functionalIndicators === 0) {
    patterns.primary = 'procedural';
    patterns.description =
      'This codebase uses a procedural approach with straightforward, step-by-step code execution. Functions perform specific tasks without heavy reliance on OOP or FP paradigms.';
  } else {
    patterns.primary = 'mixed';
    patterns.description =
      'This codebase blends Object-Oriented and Functional Programming paradigms. It uses classes where appropriate while also leveraging functional concepts like pure functions and immutability.';
  }

  // Remove duplicates
  patterns.patterns = [...new Set(patterns.patterns)];

  return patterns;
}

// Detect architecture style
function detectArchitecture(paths, packageData, structure) {
  const architecture = {
    style: 'monolith',
    layers: [],
    description: '',
  };

  const allDeps = {
    ...packageData?.dependencies,
    ...packageData?.devDependencies,
  };

  // Check for microservices indicators
  if (
    paths.some((p) => p.includes('docker-compose')) ||
    paths.some((p) => p.includes('kubernetes') || p.includes('k8s'))
  ) {
    const serviceCount = paths.filter(
      (p) =>
        p.includes('service') &&
        (p.includes('dockerfile') || p.includes('package.json'))
    ).length;
    if (serviceCount > 2) {
      architecture.style = 'microservices';
    }
  }

  // Check for serverless
  if (
    paths.some(
      (p) => p.includes('serverless.yml') || p.includes('serverless.yaml')
    ) ||
    allDeps?.serverless ||
    paths.some((p) => p.includes('lambda') || p.includes('functions'))
  ) {
    architecture.style = 'serverless';
  }

  // Check for JAMstack
  if (
    (allDeps?.next || allDeps?.gatsby || allDeps?.nuxt || allDeps?.astro) &&
    !structure.hasServer
  ) {
    architecture.style = 'jamstack';
  }

  // Detect layers
  if (
    structure.hasClient ||
    paths.some(
      (p) => p.includes('component') || p.includes('view') || p.includes('page')
    )
  ) {
    architecture.layers.push('Presentation Layer');
  }
  if (
    paths.some(
      (p) =>
        p.includes('service') || p.includes('usecase') || p.includes('business')
    )
  ) {
    architecture.layers.push('Business Logic Layer');
  }
  if (
    paths.some(
      (p) =>
        p.includes('repository') ||
        p.includes('model') ||
        p.includes('database') ||
        p.includes('db')
    )
  ) {
    architecture.layers.push('Data Access Layer');
  }
  if (
    paths.some(
      (p) =>
        p.includes('api') || p.includes('route') || p.includes('controller')
    )
  ) {
    architecture.layers.push('API Layer');
  }

  // Generate description
  const descriptions = {
    monolith:
      'A traditional monolithic architecture where all components are tightly integrated into a single deployable unit. This approach simplifies development and deployment for small to medium projects.',
    microservices:
      'A distributed microservices architecture with multiple independent services. Each service handles a specific business capability and can be developed, deployed, and scaled independently.',
    serverless:
      'A serverless architecture using cloud functions (AWS Lambda, Vercel Functions, etc.). Code runs on-demand without managing servers, offering automatic scaling and pay-per-use pricing.',
    jamstack:
      'A modern JAMstack architecture with pre-rendered pages and API-driven dynamic content. This provides excellent performance, security, and developer experience through static site generation.',
  };

  architecture.description =
    descriptions[architecture.style] || descriptions.monolith;

  return architecture;
}

// Analyze repository structure and tech stack
async function analyzeRepository(accessToken, owner, repo) {
  const analysis = {
    techStack: {
      frontend: [],
      backend: [],
      database: [],
      styling: [],
      testing: [],
      devops: [],
      other: [],
    },
    structure: {
      hasClient: false,
      hasServer: false,
      hasSrc: false,
      hasTests: false,
      hasDocker: false,
      hasCICD: false,
      hasReadme: false,
      hasEnvExample: false,
      hasLicense: false,
      hasContributing: false,
    },
    files: {
      total: 0,
      byExtension: {},
      byFolder: {},
    },
    detectedFeatures: [],
    missingFeatures: [],
    suggestions: [],
    codePatterns: [],
    codeQuality: {},
    designPatterns: {},
    architecture: {},
  };

  try {
    // Get file tree
    const tree = await getRepoTree(accessToken, owner, repo);
    analysis.files.total = tree.filter((f) => f.type === 'blob').length;

    // Analyze file extensions and folders
    tree.forEach((file) => {
      if (file.type === 'blob') {
        const ext = file.path.split('.').pop()?.toLowerCase();
        if (ext) {
          analysis.files.byExtension[ext] =
            (analysis.files.byExtension[ext] || 0) + 1;
        }

        const folder = file.path.split('/')[0];
        if (folder && folder !== file.path) {
          analysis.files.byFolder[folder] =
            (analysis.files.byFolder[folder] || 0) + 1;
        }
      }
    });

    const paths = tree.map((f) => f.path.toLowerCase());

    // Check structure
    analysis.structure.hasClient = paths.some(
      (p) =>
        p.startsWith('client/') ||
        p.startsWith('frontend/') ||
        p.startsWith('web/')
    );
    analysis.structure.hasServer = paths.some(
      (p) =>
        p.startsWith('server/') ||
        p.startsWith('backend/') ||
        p.startsWith('api/')
    );
    analysis.structure.hasSrc = paths.some((p) => p.startsWith('src/'));
    analysis.structure.hasTests = paths.some(
      (p) => p.includes('test') || p.includes('spec') || p.includes('__tests__')
    );
    analysis.structure.hasDocker = paths.some(
      (p) => p.includes('dockerfile') || p.includes('docker-compose')
    );
    analysis.structure.hasCICD = paths.some(
      (p) => p.includes('.github/workflows') || p.includes('.gitlab-ci')
    );
    analysis.structure.hasReadme = paths.some((p) => p.includes('readme'));
    analysis.structure.hasEnvExample = paths.some(
      (p) => p.includes('.env.example') || p.includes('.env.sample')
    );
    analysis.structure.hasLicense = paths.some((p) => p.includes('license'));
    analysis.structure.hasContributing = paths.some((p) =>
      p.includes('contributing')
    );

    // Get package.json data
    let mainPackageData = null;
    const packageJsonPaths = [
      'package.json',
      'client/package.json',
      'frontend/package.json',
      'server/package.json',
      'backend/package.json',
      'api/package.json',
    ];

    for (const pkgPath of packageJsonPaths) {
      const fileData = await getFileContent(accessToken, owner, repo, pkgPath);
      if (fileData) {
        try {
          const pkg = JSON.parse(fileData.content);
          if (pkgPath === 'package.json') mainPackageData = pkg;

          const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

          Object.keys(allDeps).forEach((dep) => {
            const depLower = dep.toLowerCase();

            // Frontend frameworks
            if (
              [
                'react',
                'vue',
                'angular',
                'svelte',
                'solid',
                'preact',
                'next',
                'nuxt',
                'gatsby',
                'remix',
                'astro',
              ].some((f) => depLower.includes(f))
            ) {
              if (!analysis.techStack.frontend.includes(dep))
                analysis.techStack.frontend.push(dep);
            }
            // Backend frameworks
            else if (
              [
                'express',
                'fastify',
                'koa',
                'hapi',
                'nestjs',
                'hono',
                'elysia',
                'adonis',
              ].some((f) => depLower.includes(f))
            ) {
              if (!analysis.techStack.backend.includes(dep))
                analysis.techStack.backend.push(dep);
            }
            // Databases
            else if (
              [
                'mongoose',
                'mongodb',
                'pg',
                'mysql',
                'sequelize',
                'prisma',
                'typeorm',
                'drizzle',
                'redis',
                'firebase',
                'supabase',
              ].some((f) => depLower.includes(f))
            ) {
              if (!analysis.techStack.database.includes(dep))
                analysis.techStack.database.push(dep);
            }
            // Styling
            else if (
              [
                'tailwind',
                'styled-components',
                'sass',
                'less',
                'emotion',
                'chakra',
                '@mui',
                'bootstrap',
                'antd',
              ].some((f) => depLower.includes(f))
            ) {
              if (!analysis.techStack.styling.includes(dep))
                analysis.techStack.styling.push(dep);
            }
            // Testing
            else if (
              [
                'jest',
                'mocha',
                'chai',
                'cypress',
                'playwright',
                'vitest',
                'testing-library',
                'supertest',
              ].some((f) => depLower.includes(f))
            ) {
              if (!analysis.techStack.testing.includes(dep))
                analysis.techStack.testing.push(dep);
            }
            // DevOps
            else if (
              [
                'docker',
                'kubernetes',
                'terraform',
                'aws-sdk',
                'vercel',
                'netlify',
              ].some((f) => depLower.includes(f))
            ) {
              if (!analysis.techStack.devops.includes(dep))
                analysis.techStack.devops.push(dep);
            }
          });

          // Detect scripts
          if (pkg.scripts) {
            if (pkg.scripts.test) analysis.codePatterns.push('Has test script');
            if (pkg.scripts.lint) analysis.codePatterns.push('Has linting');
            if (pkg.scripts.build)
              analysis.codePatterns.push('Has build process');
            if (pkg.scripts.dev || pkg.scripts.start)
              analysis.codePatterns.push('Has dev server');
          }
        } catch (e) {
          // Invalid JSON
        }
      }
    }

    // Detect features
    const featurePatterns = [
      {
        pattern: ['auth', 'login', 'signin', 'signup', 'register'],
        feature: 'Authentication system',
      },
      { pattern: ['api/', 'routes/', 'controllers/'], feature: 'API routes' },
      { pattern: ['components/'], feature: 'UI components' },
      { pattern: ['model', 'schema', 'entities'], feature: 'Database models' },
      { pattern: ['middleware'], feature: 'Middleware layer' },
      {
        pattern: ['context', 'store', 'redux', 'zustand', 'recoil'],
        feature: 'State management',
      },
      {
        pattern: ['socket', 'websocket', 'ws'],
        feature: 'Real-time/WebSocket',
      },
      { pattern: ['upload', 'multer', 'storage'], feature: 'File upload' },
      {
        pattern: ['email', 'mailer', 'nodemailer', 'sendgrid'],
        feature: 'Email service',
      },
      {
        pattern: ['payment', 'stripe', 'paypal'],
        feature: 'Payment integration',
      },
      { pattern: ['cache', 'redis'], feature: 'Caching layer' },
      { pattern: ['queue', 'bull', 'agenda'], feature: 'Job queue' },
      { pattern: ['graphql', 'apollo'], feature: 'GraphQL API' },
      { pattern: ['swagger', 'openapi'], feature: 'API documentation' },
      {
        pattern: ['i18n', 'locale', 'translation'],
        feature: 'Internationalization',
      },
      { pattern: ['analytics', 'tracking'], feature: 'Analytics' },
      { pattern: ['seo', 'meta', 'sitemap'], feature: 'SEO optimization' },
      { pattern: ['notification', 'push'], feature: 'Notifications' },
      {
        pattern: ['search', 'elastic', 'algolia'],
        feature: 'Search functionality',
      },
      { pattern: ['admin', 'dashboard'], feature: 'Admin dashboard' },
    ];

    featurePatterns.forEach(({ pattern, feature }) => {
      if (paths.some((p) => pattern.some((pat) => p.includes(pat)))) {
        if (!analysis.detectedFeatures.includes(feature)) {
          analysis.detectedFeatures.push(feature);
        }
      }
    });

    if (analysis.structure.hasDocker)
      analysis.detectedFeatures.push('Docker configuration');
    if (analysis.structure.hasCICD)
      analysis.detectedFeatures.push('CI/CD pipeline');
    if (analysis.structure.hasTests)
      analysis.detectedFeatures.push('Test setup');

    // Missing features and suggestions
    if (!analysis.structure.hasTests && analysis.files.total > 10) {
      analysis.missingFeatures.push('No tests');
      analysis.suggestions.push('Add unit tests for critical functionality');
    }
    if (
      !analysis.structure.hasDocker &&
      analysis.techStack.backend.length > 0
    ) {
      analysis.missingFeatures.push('No Docker');
      analysis.suggestions.push('Add Dockerfile for consistent deployment');
    }
    if (!analysis.structure.hasCICD) {
      analysis.missingFeatures.push('No CI/CD');
      analysis.suggestions.push('Add GitHub Actions for automated testing');
    }
    if (!analysis.structure.hasReadme) {
      analysis.missingFeatures.push('No README');
      analysis.suggestions.push('Add README.md with setup instructions');
    }
    if (!analysis.structure.hasEnvExample) {
      analysis.missingFeatures.push('No .env.example');
      analysis.suggestions.push(
        'Add .env.example for environment documentation'
      );
    }
    if (
      analysis.techStack.frontend.length > 0 &&
      analysis.techStack.testing.length === 0
    ) {
      analysis.suggestions.push('Add frontend testing (Vitest or Cypress)');
    }

    // NEW: Code Quality Analysis
    analysis.codeQuality = analyzeCodeQuality(tree, paths, mainPackageData);

    // NEW: Design Patterns Detection
    analysis.designPatterns = detectDesignPatterns(paths, mainPackageData);

    // NEW: Architecture Detection
    analysis.architecture = detectArchitecture(
      paths,
      mainPackageData,
      analysis.structure
    );

    // Detect deploy platform
    const deploy = await detectDeployPlatform(accessToken, owner, repo, tree);
    if (deploy.detected) {
      analysis.deployPlatform = deploy.platform;
    }
  } catch (error) {
    console.error('Repository analysis error:', error);
  }

  return analysis;
}

// Detect project type from analysis
function detectProjectType(analysis) {
  const { techStack, structure } = analysis;

  if (
    techStack.frontend.some(
      (f) => f.includes('react-native') || f.includes('expo')
    )
  )
    return 'mobile-app';
  if (
    techStack.frontend.some(
      (f) => f.includes('next') || f.includes('nuxt') || f.includes('remix')
    )
  )
    return 'fullstack';
  if (structure.hasClient && structure.hasServer) return 'fullstack';
  if (techStack.backend.length > 0 && techStack.frontend.length === 0)
    return 'api';
  if (techStack.frontend.length > 0 && techStack.backend.length > 0)
    return 'fullstack';
  if (techStack.frontend.length > 0) return 'spa';
  if (techStack.backend.length > 0) return 'api';

  return 'custom';
}

// Compare project tasks with repo code
async function compareTasksWithCode(accessToken, owner, repo, phases) {
  const comparison = [];
  const tree = await getRepoTree(accessToken, owner, repo);
  const paths = tree.map((f) => f.path.toLowerCase());

  const taskPatterns = {
    authentication: [
      'auth',
      'login',
      'signup',
      'register',
      'jwt',
      'session',
      'passport',
    ],
    database: [
      'model',
      'schema',
      'migration',
      'seed',
      'mongoose',
      'prisma',
      'sequelize',
    ],
    api: ['route', 'controller', 'endpoint', 'api/', 'rest', 'graphql'],
    frontend: ['component', 'page', 'view', 'ui/', 'src/'],
    styling: ['css', 'scss', 'tailwind', 'styled', 'theme'],
    testing: ['test', 'spec', '__tests__', 'cypress', 'jest'],
    deployment: [
      'docker',
      'ci',
      'cd',
      'deploy',
      'workflow',
      'vercel',
      'netlify',
    ],
    documentation: ['readme', 'docs/', 'doc/', 'swagger', 'openapi'],
    security: ['helmet', 'cors', 'rate-limit', 'sanitize', 'validate'],
    'error handling': ['error', 'exception', 'catch', 'try'],
    'state management': ['store', 'redux', 'context', 'zustand', 'recoil'],
    'real-time': ['socket', 'websocket', 'ws', 'realtime'],
    'file upload': ['upload', 'multer', 'storage', 'file'],
    email: ['email', 'mail', 'smtp', 'nodemailer'],
    payment: ['payment', 'stripe', 'checkout', 'billing'],
    search: ['search', 'filter', 'query', 'elastic'],
    notification: ['notification', 'push', 'alert'],
    caching: ['cache', 'redis', 'memcache'],
    logging: ['log', 'logger', 'winston', 'pino'],
    validation: ['valid', 'joi', 'zod', 'yup', 'schema'],
  };

  phases.forEach((phase) => {
    const phaseComparison = {
      phaseId: phase._id,
      phaseTitle: phase.title,
      tasks: [],
    };

    phase.subTasks?.forEach((task) => {
      const taskTitle = task.title.toLowerCase();
      let codeEvidence = [];
      let matchScore = 0;

      Object.entries(taskPatterns).forEach(([category, keywords]) => {
        if (keywords.some((kw) => taskTitle.includes(kw))) {
          const matchingFiles = paths.filter((p) =>
            keywords.some((kw) => p.includes(kw))
          );

          if (matchingFiles.length > 0) {
            codeEvidence.push({
              category,
              files: matchingFiles.slice(0, 5),
            });
            matchScore += Math.min(matchingFiles.length * 20, 100);
          }
        }
      });

      matchScore = Math.min(matchScore, 100);

      phaseComparison.tasks.push({
        taskId: task._id,
        taskTitle: task.title,
        isComplete: task.isComplete,
        codeEvidence,
        matchScore,
        status:
          matchScore >= 60
            ? 'likely-done'
            : matchScore >= 30
            ? 'in-progress'
            : 'not-started',
      });
    });

    comparison.push(phaseComparison);
  });

  return comparison;
}

// Explain file content
async function explainFile(accessToken, owner, repo, filePath) {
  const fileData = await getFileContent(accessToken, owner, repo, filePath);

  if (!fileData) {
    return { error: 'File not found' };
  }

  const extension = filePath.split('.').pop()?.toLowerCase();
  const fileName = filePath.split('/').pop();
  const content = fileData.content;

  // Analyze the file locally (without AI for privacy)
  const explanation = generateFileExplanation(
    fileName,
    extension,
    content,
    filePath
  );

  return {
    path: filePath,
    name: fileName,
    extension,
    size: fileData.size,
    explanation,
  };
}

// Generate file explanation based on content analysis
function generateFileExplanation(fileName, extension, content, filePath) {
  const lines = content.split('\n');
  const lineCount = lines.length;

  let purpose = '';
  let keyElements = [];
  let dependencies = [];
  let exports = [];

  // Detect file purpose based on path and name
  if (filePath.includes('component')) {
    purpose = 'This is a UI component that renders visual elements.';
  } else if (filePath.includes('hook') || fileName.startsWith('use')) {
    purpose = 'This is a custom React hook that encapsulates reusable logic.';
  } else if (filePath.includes('context')) {
    purpose =
      'This is a React context provider for sharing state across components.';
  } else if (filePath.includes('service')) {
    purpose =
      'This is a service module that handles business logic or external API calls.';
  } else if (filePath.includes('controller')) {
    purpose = 'This is a controller that handles HTTP requests and responses.';
  } else if (filePath.includes('route')) {
    purpose = 'This file defines API routes and their handlers.';
  } else if (filePath.includes('model') || filePath.includes('schema')) {
    purpose = 'This file defines a data model/schema for database operations.';
  } else if (filePath.includes('middleware')) {
    purpose =
      'This is middleware that processes requests before they reach route handlers.';
  } else if (filePath.includes('util') || filePath.includes('helper')) {
    purpose =
      'This file contains utility/helper functions used across the codebase.';
  } else if (filePath.includes('config')) {
    purpose = 'This file contains configuration settings for the application.';
  } else if (filePath.includes('test') || filePath.includes('spec')) {
    purpose = 'This is a test file that verifies functionality.';
  } else if (fileName === 'index.js' || fileName === 'index.ts') {
    purpose = 'This is an entry point that exports module contents.';
  } else if (fileName === 'App.jsx' || fileName === 'App.tsx') {
    purpose =
      'This is the main application component that serves as the root of the UI tree.';
  } else if (
    fileName === 'main.jsx' ||
    fileName === 'main.tsx' ||
    fileName === 'index.jsx'
  ) {
    purpose = 'This is the application entry point that bootstraps the app.';
  }

  // Analyze imports
  const importLines = lines.filter(
    (l) => l.trim().startsWith('import ') || l.includes('require(')
  );
  if (importLines.length > 0) {
    dependencies = importLines
      .slice(0, 5)
      .map((l) => {
        const match = l.match(/from\s+['"]([^'"]+)['"]/);
        if (match) return match[1];
        const reqMatch = l.match(/require\(['"]([^'"]+)['"]\)/);
        if (reqMatch) return reqMatch[1];
        return null;
      })
      .filter(Boolean);
  }

  // Analyze exports
  const exportLines = lines.filter(
    (l) =>
      l.includes('export ') ||
      l.includes('module.exports') ||
      l.includes('exports.')
  );
  if (exportLines.length > 0) {
    exports = exportLines.slice(0, 3).map((l) => l.trim().substring(0, 60));
  }

  // Detect key elements based on content
  if (content.includes('useState') || content.includes('useEffect')) {
    keyElements.push('React Hooks for state and side effects');
  }
  if (content.includes('async ') || content.includes('await ')) {
    keyElements.push('Asynchronous operations');
  }
  if (content.includes('try {') || content.includes('catch (')) {
    keyElements.push('Error handling');
  }
  if (content.includes('class ') && content.includes('extends')) {
    keyElements.push('Class-based component/module with inheritance');
  }
  if (content.includes('interface ') || content.includes('type ')) {
    keyElements.push('TypeScript type definitions');
  }
  if (content.includes('Schema(') || content.includes('model(')) {
    keyElements.push('Database schema definition');
  }
  if (
    content.includes('router.') ||
    content.includes('app.get') ||
    content.includes('app.post')
  ) {
    keyElements.push('HTTP route definitions');
  }
  if (content.includes('socket') || content.includes('emit(')) {
    keyElements.push('WebSocket/real-time communication');
  }
  if (content.includes('jwt') || content.includes('token')) {
    keyElements.push('JWT authentication handling');
  }
  if (content.includes('bcrypt') || content.includes('hash')) {
    keyElements.push('Password hashing/security');
  }

  // File type specific analysis
  let typeAnalysis = '';
  if (extension === 'jsx' || extension === 'tsx') {
    typeAnalysis = 'React component file using JSX syntax.';
    if (content.includes('return (') && content.includes('<')) {
      keyElements.push('Returns JSX markup');
    }
  } else if (extension === 'css' || extension === 'scss') {
    typeAnalysis = 'Stylesheet defining visual appearance.';
    const classCount = (content.match(/\.[a-zA-Z]/g) || []).length;
    keyElements.push(`Approximately ${classCount} CSS classes defined`);
  } else if (extension === 'json') {
    typeAnalysis = 'JSON configuration or data file.';
    try {
      const parsed = JSON.parse(content);
      keyElements.push(`Contains ${Object.keys(parsed).length} top-level keys`);
    } catch (e) {}
  } else if (extension === 'md') {
    typeAnalysis = 'Markdown documentation file.';
    const headings = (content.match(/^#+\s/gm) || []).length;
    keyElements.push(`${headings} section headings`);
  }

  return {
    purpose:
      purpose || `A ${extension?.toUpperCase() || 'code'} file in the project.`,
    typeAnalysis,
    lineCount,
    dependencies: dependencies.slice(0, 5),
    exports: exports.slice(0, 3),
    keyElements: keyElements.slice(0, 5),
    complexity: lineCount > 300 ? 'High' : lineCount > 100 ? 'Medium' : 'Low',
  };
}

module.exports = {
  getGitHubUser,
  getUserRepos,
  getRepoDetails,
  getFileContent,
  getDirectoryContents,
  getRepoTree,
  getBranches,
  getPullRequests,
  getIssues,
  getRecentCommits,
  getContributors,
  createRepo,
  createOrUpdateFile,
  detectDeployPlatform,
  analyzeCodeQuality,
  detectDesignPatterns,
  detectArchitecture,
  analyzeRepository,
  detectProjectType,
  compareTasksWithCode,
  explainFile,
};
