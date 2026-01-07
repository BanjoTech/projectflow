// server/services/githubService.js

const { Octokit } = require('@octokit/rest');

// Create Octokit instance with user's access token
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
async function getUserRepos(accessToken, page = 1, perPage = 30) {
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
async function getFileContent(accessToken, owner, repo, path) {
  const octokit = createOctokit(accessToken);
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if (data.content) {
      return Buffer.from(data.content, 'base64').toString('utf8');
    }
    return null;
  } catch (error) {
    if (error.status === 404) return null;
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
    // Try 'master' if 'main' fails
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

// Get recent commits (for display only, not auto-complete)
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
      message: commit.commit.message.split('\n')[0], // First line only
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url,
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

// Analyze repository structure and tech stack
async function analyzeRepository(accessToken, owner, repo) {
  const analysis = {
    techStack: {
      frontend: [],
      backend: [],
      database: [],
      styling: [],
      testing: [],
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
    },
    files: {
      total: 0,
      byExtension: {},
    },
    detectedFeatures: [],
    missingFeatures: [],
    suggestions: [],
  };

  try {
    // Get file tree
    const tree = await getRepoTree(accessToken, owner, repo);
    analysis.files.total = tree.filter((f) => f.type === 'blob').length;

    // Analyze file extensions
    tree.forEach((file) => {
      if (file.type === 'blob') {
        const ext = file.path.split('.').pop()?.toLowerCase();
        if (ext) {
          analysis.files.byExtension[ext] =
            (analysis.files.byExtension[ext] || 0) + 1;
        }
      }
    });

    // Check structure
    const paths = tree.map((f) => f.path.toLowerCase());
    analysis.structure.hasClient = paths.some(
      (p) => p.startsWith('client/') || p.startsWith('frontend/')
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

    // Try to get package.json files
    const packageJsonPaths = [
      'package.json',
      'client/package.json',
      'frontend/package.json',
      'server/package.json',
      'backend/package.json',
    ];

    for (const pkgPath of packageJsonPaths) {
      const content = await getFileContent(accessToken, owner, repo, pkgPath);
      if (content) {
        try {
          const pkg = JSON.parse(content);
          const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

          Object.keys(allDeps).forEach((dep) => {
            const depLower = dep.toLowerCase();

            // Categorize dependencies
            if (
              [
                'react',
                'vue',
                'angular',
                'svelte',
                'next',
                'nuxt',
                'gatsby',
                'solid',
              ].some((f) => depLower.includes(f))
            ) {
              if (!analysis.techStack.frontend.includes(dep))
                analysis.techStack.frontend.push(dep);
            } else if (
              ['express', 'fastify', 'koa', 'hapi', 'nestjs', 'hono'].some(
                (f) => depLower.includes(f)
              )
            ) {
              if (!analysis.techStack.backend.includes(dep))
                analysis.techStack.backend.push(dep);
            } else if (
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
              ].some((f) => depLower.includes(f))
            ) {
              if (!analysis.techStack.database.includes(dep))
                analysis.techStack.database.push(dep);
            } else if (
              [
                'tailwind',
                'styled-components',
                'sass',
                'less',
                'emotion',
                'chakra',
                '@mui',
                'bootstrap',
              ].some((f) => depLower.includes(f))
            ) {
              if (!analysis.techStack.styling.includes(dep))
                analysis.techStack.styling.push(dep);
            } else if (
              [
                'jest',
                'mocha',
                'chai',
                'cypress',
                'playwright',
                'vitest',
                'testing-library',
              ].some((f) => depLower.includes(f))
            ) {
              if (!analysis.techStack.testing.includes(dep))
                analysis.techStack.testing.push(dep);
            }
          });
        } catch (e) {
          // Invalid JSON, skip
        }
      }
    }

    // Detect what's built based on file structure
    if (
      paths.some(
        (p) => p.includes('auth') || p.includes('login') || p.includes('signin')
      )
    ) {
      analysis.detectedFeatures.push('Authentication system');
    }
    if (paths.some((p) => p.includes('api/') || p.includes('routes/'))) {
      analysis.detectedFeatures.push('API routes');
    }
    if (paths.some((p) => p.includes('components/'))) {
      analysis.detectedFeatures.push('UI components');
    }
    if (paths.some((p) => p.includes('model') || p.includes('schema'))) {
      analysis.detectedFeatures.push('Database models');
    }
    if (paths.some((p) => p.includes('middleware'))) {
      analysis.detectedFeatures.push('Middleware');
    }
    if (
      paths.some(
        (p) =>
          p.includes('context') || p.includes('store') || p.includes('redux')
      )
    ) {
      analysis.detectedFeatures.push('State management');
    }
    if (analysis.structure.hasDocker) {
      analysis.detectedFeatures.push('Docker configuration');
    }
    if (analysis.structure.hasCICD) {
      analysis.detectedFeatures.push('CI/CD pipeline');
    }
    if (analysis.structure.hasTests) {
      analysis.detectedFeatures.push('Test setup');
    }

    // Generate suggestions for what's missing
    if (!analysis.structure.hasTests && analysis.files.total > 10) {
      analysis.missingFeatures.push('No tests');
      analysis.suggestions.push('Add unit tests for critical functionality');
    }
    if (
      !analysis.structure.hasDocker &&
      analysis.techStack.backend.length > 0
    ) {
      analysis.missingFeatures.push('No Docker');
      analysis.suggestions.push('Add Dockerfile for containerization');
    }
    if (!analysis.structure.hasCICD) {
      analysis.missingFeatures.push('No CI/CD');
      analysis.suggestions.push(
        'Add GitHub Actions for automated testing/deployment'
      );
    }
    if (!analysis.structure.hasReadme) {
      analysis.missingFeatures.push('No README');
      analysis.suggestions.push('Add README.md with project documentation');
    }
    if (
      analysis.techStack.frontend.length > 0 &&
      analysis.techStack.testing.length === 0
    ) {
      analysis.suggestions.push(
        'Add frontend testing (Vitest, Jest, or Cypress)'
      );
    }
    if (
      !paths.some(
        (p) => p.includes('.env.example') || p.includes('.env.sample')
      )
    ) {
      analysis.suggestions.push(
        'Add .env.example for environment documentation'
      );
    }
    if (!paths.some((p) => p.includes('error') || p.includes('exception'))) {
      analysis.suggestions.push('Add proper error handling');
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
  if (techStack.frontend.some((f) => f.includes('next'))) return 'fullstack';
  if (structure.hasClient && structure.hasServer) return 'fullstack';
  if (techStack.backend.length > 0 && techStack.frontend.length === 0)
    return 'api';
  if (techStack.frontend.length > 0 && techStack.backend.length > 0)
    return 'fullstack';
  if (techStack.frontend.length > 0) return 'spa';
  if (techStack.backend.length > 0) return 'api';

  return 'custom';
}

module.exports = {
  getGitHubUser,
  getUserRepos,
  getRepoDetails,
  getFileContent,
  getRepoTree,
  getRecentCommits,
  createRepo,
  createOrUpdateFile,
  analyzeRepository,
  detectProjectType,
};
