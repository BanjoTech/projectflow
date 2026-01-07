// server/controllers/githubController.js

const axios = require('axios');
const User = require('../models/User');
const Project = require('../models/Project');
const {
  getGitHubUser,
  getUserRepos,
  getRepoDetails,
  getRecentCommits,
  analyzeRepository,
  detectProjectType,
  createRepo,
  createOrUpdateFile,
} = require('../services/githubService');
const { generateDynamicPhases } = require('../services/aiService');
const { Octokit } = require('@octokit/rest');

// @desc    Get GitHub OAuth URL
// @route   GET /api/github/auth-url
// @access  Private
const getAuthUrl = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;
    const scope = 'read:user user:email repo';
    const state = req.user._id.toString();

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&state=${state}`;

    res.json({ url: authUrl });
  } catch (error) {
    console.error('Get auth URL error:', error);
    res.status(500).json({ message: 'Failed to generate auth URL' });
  }
};

// @desc    Handle GitHub OAuth callback
// @route   POST /api/github/callback
// @access  Private
const handleCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ message: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const { access_token, error, error_description } = tokenResponse.data;

    if (error) {
      console.error('GitHub OAuth error:', error, error_description);
      return res
        .status(400)
        .json({ message: error_description || 'OAuth failed' });
    }

    // Get GitHub user info
    const githubUser = await getGitHubUser(access_token);

    // Update user with GitHub info
    await User.findByIdAndUpdate(req.user._id, {
      github: {
        id: githubUser.id.toString(),
        username: githubUser.login,
        accessToken: access_token,
        avatarUrl: githubUser.avatar_url,
        profileUrl: githubUser.html_url,
        connectedAt: new Date(),
      },
    });

    res.json({
      message: 'GitHub connected successfully',
      github: {
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
      },
    });
  } catch (error) {
    console.error('GitHub callback error:', error);
    res.status(500).json({ message: 'Failed to connect GitHub' });
  }
};

// @desc    Disconnect GitHub
// @route   DELETE /api/github/disconnect
// @access  Private
const disconnectGitHub = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { github: 1 } });
    res.json({ message: 'GitHub disconnected' });
  } catch (error) {
    console.error('Disconnect GitHub error:', error);
    res.status(500).json({ message: 'Failed to disconnect GitHub' });
  }
};

// @desc    Get GitHub connection status
// @route   GET /api/github/status
// @access  Private
const getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );

    if (!user.github?.accessToken) {
      return res.json({ connected: false });
    }

    try {
      const githubUser = await getGitHubUser(user.github.accessToken);
      res.json({
        connected: true,
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
      });
    } catch (e) {
      // Token is invalid
      await User.findByIdAndUpdate(req.user._id, { $unset: { github: 1 } });
      res.json({ connected: false });
    }
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ message: 'Failed to get status' });
  }
};

// @desc    Get user's GitHub repositories
// @route   GET /api/github/repos
// @access  Private
const getRepos = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );

    if (!user.github?.accessToken) {
      return res.status(400).json({ message: 'GitHub not connected' });
    }

    const page = parseInt(req.query.page) || 1;
    const repos = await getUserRepos(user.github.accessToken, page);

    const simplifiedRepos = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      isPrivate: repo.private,
      language: repo.language,
      updatedAt: repo.updated_at,
      defaultBranch: repo.default_branch,
    }));

    res.json(simplifiedRepos);
  } catch (error) {
    console.error('Get repos error:', error);
    res.status(500).json({ message: 'Failed to get repositories' });
  }
};

// @desc    Analyze a repository
// @route   POST /api/github/analyze
// @access  Private
const analyzeRepo = async (req, res) => {
  try {
    const { owner, repo } = req.body;
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );

    if (!user.github?.accessToken) {
      return res.status(400).json({ message: 'GitHub not connected' });
    }

    const [analysis, repoDetails, commits] = await Promise.all([
      analyzeRepository(user.github.accessToken, owner, repo),
      getRepoDetails(user.github.accessToken, owner, repo),
      getRecentCommits(user.github.accessToken, owner, repo),
    ]);

    res.json({
      repo: {
        name: repoDetails.name,
        fullName: repoDetails.full_name,
        description: repoDetails.description,
        url: repoDetails.html_url,
        defaultBranch: repoDetails.default_branch,
        language: repoDetails.language,
      },
      analysis,
      recentCommits: commits,
    });
  } catch (error) {
    console.error('Analyze repo error:', error);
    res.status(500).json({ message: 'Failed to analyze repository' });
  }
};

// @desc    Import project from GitHub repository
// @route   POST /api/github/import
// @access  Private
const importFromGitHub = async (req, res) => {
  try {
    const { owner, repo, projectName } = req.body;
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );

    if (!user.github?.accessToken) {
      return res.status(400).json({ message: 'GitHub not connected' });
    }

    // Get repo details and analyze
    const [repoDetails, analysis] = await Promise.all([
      getRepoDetails(user.github.accessToken, owner, repo),
      analyzeRepository(user.github.accessToken, owner, repo),
    ]);

    const name = projectName || repoDetails.name;
    const description = repoDetails.description || '';
    const projectType = detectProjectType(analysis);

    // Generate phases using AI, informed by what's already built
    let phases;
    try {
      const analysisContext = `
This is an EXISTING project imported from GitHub.

ALREADY BUILT:
${
  analysis.detectedFeatures.map((f) => `- ${f}`).join('\n') ||
  '- Unknown (needs review)'
}

TECH STACK DETECTED:
- Frontend: ${analysis.techStack.frontend.join(', ') || 'None'}
- Backend: ${analysis.techStack.backend.join(', ') || 'None'}
- Database: ${analysis.techStack.database.join(', ') || 'None'}
- Styling: ${analysis.techStack.styling.join(', ') || 'None'}

MISSING/NEEDS WORK:
${analysis.missingFeatures.map((f) => `- ${f}`).join('\n') || '- Unknown'}
${analysis.suggestions.map((s) => `- ${s}`).join('\n')}

Generate phases focusing on:
1. Review & assess what's already built (mark as complete)
2. Tasks for missing features
3. Testing & optimization
4. Deployment & documentation`;

      const result = await generateDynamicPhases(
        name,
        description + '\n\n' + analysisContext,
        projectType
      );
      phases = result.phases;
    } catch (aiError) {
      console.error('AI phase generation failed:', aiError);
      // Fallback phases for imported project
      phases = [
        {
          id: 0,
          title: 'Project Review',
          description: 'Review imported codebase',
          isComplete: false,
          completedAt: null,
          notes: '',
          subTasks: [
            {
              title: 'Review existing code structure',
              isComplete: false,
              description: '',
            },
            {
              title: 'Understand current functionality',
              isComplete: false,
              description: '',
            },
            {
              title: 'Identify areas for improvement',
              isComplete: false,
              description: '',
            },
          ],
        },
        {
          id: 1,
          title: 'Continue Development',
          description: 'Add remaining features',
          isComplete: false,
          completedAt: null,
          notes: '',
          subTasks: analysis.suggestions.map((s, i) => ({
            title: s,
            isComplete: false,
            description: '',
          })),
        },
      ];
    }

    // Create project
    const project = await Project.create({
      user: req.user._id,
      name,
      description,
      type: projectType,
      phases,
      metadata: {
        importedFromGitHub: true,
        estimatedDuration: 'Based on remaining work',
        complexity: 'medium',
      },
      github: {
        repoId: repoDetails.id,
        repoName: repoDetails.name,
        repoFullName: repoDetails.full_name,
        repoUrl: repoDetails.html_url,
        defaultBranch: repoDetails.default_branch,
        isConnected: true,
        lastSyncedAt: new Date(),
        analysis: {
          techStack: analysis.techStack,
          structure: analysis.structure,
          detectedFeatures: analysis.detectedFeatures,
          missingFeatures: analysis.missingFeatures,
        },
      },
    });

    project.generateInviteCode();
    project.calculateProgress();
    await project.save();
    await project.populate('user', 'name email');

    res.status(201).json({
      project,
      analysis,
    });
  } catch (error) {
    console.error('Import from GitHub error:', error);
    res
      .status(500)
      .json({ message: 'Failed to import from GitHub', error: error.message });
  }
};

// @desc    Connect existing project to GitHub repo
// @route   POST /api/github/connect/:projectId
// @access  Private
const connectProjectToRepo = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { owner, repo } = req.body;
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );

    if (!user.github?.accessToken) {
      return res.status(400).json({ message: 'GitHub not connected' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const [repoDetails, analysis] = await Promise.all([
      getRepoDetails(user.github.accessToken, owner, repo),
      analyzeRepository(user.github.accessToken, owner, repo),
    ]);

    project.github = {
      repoId: repoDetails.id,
      repoName: repoDetails.name,
      repoFullName: repoDetails.full_name,
      repoUrl: repoDetails.html_url,
      defaultBranch: repoDetails.default_branch,
      isConnected: true,
      lastSyncedAt: new Date(),
      analysis: {
        techStack: analysis.techStack,
        structure: analysis.structure,
        detectedFeatures: analysis.detectedFeatures,
        missingFeatures: analysis.missingFeatures,
      },
    };

    await project.save();
    await project.populate('user', 'name email');

    res.json({ project, analysis });
  } catch (error) {
    console.error('Connect project error:', error);
    res.status(500).json({ message: 'Failed to connect to GitHub' });
  }
};

// @desc    Create GitHub repo from project
// @route   POST /api/github/create-repo/:projectId
// @access  Private
const createRepoFromProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { isPrivate = false } = req.body;
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );

    if (!user.github?.accessToken) {
      return res.status(400).json({ message: 'GitHub not connected' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create repo name from project name
    const repoName = project.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newRepo = await createRepo(
      user.github.accessToken,
      repoName,
      project.description,
      isPrivate
    );

    // Update project
    project.github = {
      repoId: newRepo.id,
      repoName: newRepo.name,
      repoFullName: newRepo.full_name,
      repoUrl: newRepo.html_url,
      defaultBranch: newRepo.default_branch,
      isConnected: true,
      lastSyncedAt: new Date(),
    };

    await project.save();

    // Create README
    try {
      const readme = generateReadme(project);
      await createOrUpdateFile(
        user.github.accessToken,
        user.github.username,
        repoName,
        'README.md',
        readme,
        'Initial commit: Add README from ProjectFlow'
      );
    } catch (e) {
      console.error('Failed to create README:', e);
    }

    res.json({
      project,
      repo: {
        name: newRepo.name,
        fullName: newRepo.full_name,
        url: newRepo.html_url,
      },
    });
  } catch (error) {
    console.error('Create repo error:', error);
    res.status(500).json({ message: 'Failed to create repository' });
  }
};

// @desc    Get recent commits for connected project
// @route   GET /api/github/commits/:projectId
// @access  Private
const getProjectCommits = async (req, res) => {
  try {
    const { projectId } = req.params;
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );

    if (!user.github?.accessToken) {
      return res.status(400).json({ message: 'GitHub not connected' });
    }

    const project = await Project.findById(projectId);
    if (!project?.github?.isConnected) {
      return res
        .status(400)
        .json({ message: 'Project not connected to GitHub' });
    }

    const [owner, repo] = project.github.repoFullName.split('/');
    const commits = await getRecentCommits(
      user.github.accessToken,
      owner,
      repo
    );

    res.json(commits);
  } catch (error) {
    console.error('Get commits error:', error);
    res.status(500).json({ message: 'Failed to get commits' });
  }
};

// @desc    Refresh repo analysis
// @route   POST /api/github/sync/:projectId
// @access  Private
const syncProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );

    if (!user.github?.accessToken) {
      return res.status(400).json({ message: 'GitHub not connected' });
    }

    const project = await Project.findById(projectId);
    if (!project?.github?.isConnected) {
      return res
        .status(400)
        .json({ message: 'Project not connected to GitHub' });
    }

    const [owner, repo] = project.github.repoFullName.split('/');
    const analysis = await analyzeRepository(
      user.github.accessToken,
      owner,
      repo
    );

    project.github.lastSyncedAt = new Date();
    project.github.analysis = {
      techStack: analysis.techStack,
      structure: analysis.structure,
      detectedFeatures: analysis.detectedFeatures,
      missingFeatures: analysis.missingFeatures,
    };

    await project.save();

    res.json({
      analysis,
      suggestions: analysis.suggestions,
      lastSyncedAt: project.github.lastSyncedAt,
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Failed to sync' });
  }
};

// Helper: Generate README
function generateReadme(project) {
  const phases = project.phases
    .map(
      (p) => `- ${p.isComplete ? '✅' : '⬜'} **${p.title}** - ${p.description}`
    )
    .join('\n');

  return `# ${project.name}

${project.description || ''}

## Development Phases

${phases}

## Progress

${project.progress}% complete

---

*Managed with [ProjectFlow](https://projectflowww.netlify.app)*
`;
}

module.exports = {
  getAuthUrl,
  handleCallback,
  disconnectGitHub,
  getStatus,
  getRepos,
  analyzeRepo,
  importFromGitHub,
  connectProjectToRepo,
  createRepoFromProject,
  getProjectCommits,
  syncProject,
};
