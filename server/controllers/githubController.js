// server/controllers/githubController.js

const axios = require('axios');
const User = require('../models/User');
const Project = require('../models/Project');
const {
  getGitHubUser,
  getUserRepos,
  getRepoDetails,
  createRepo,
  createOrUpdateFile,
  analyzeRepository,
  getRecentCommits,
  detectProjectType,
} = require('../services/githubService');

// @desc    Get GitHub OAuth URL
// @route   GET /api/github/auth-url
// @access  Private
const getAuthUrl = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    if (!clientId || !redirectUri) {
      console.error('Missing GitHub Environment Variables');
      return res
        .status(500)
        .json({ message: 'Server misconfiguration: Missing GitHub creds' });
    }

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

    if (error || !access_token) {
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
    res.status(500).json({ message: 'Failed to disconnect' });
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

    // Verify token validity by fetching user
    try {
      const githubUser = await getGitHubUser(user.github.accessToken);
      res.json({
        connected: true,
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
      });
    } catch {
      // If token invalid, disconnect
      await User.findByIdAndUpdate(req.user._id, { $unset: { github: 1 } });
      res.json({ connected: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking status' });
  }
};

// @desc    Get user's repositories
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

    const repos = await getUserRepos(user.github.accessToken);

    res.json(
      repos.map((r) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        isPrivate: r.private,
        url: r.html_url,
        updatedAt: r.updated_at,
        defaultBranch: r.default_branch,
      }))
    );
  } catch (error) {
    console.error('Get repos error:', error);
    res.status(500).json({ message: 'Failed to fetch repositories' });
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

    const analysis = await analyzeRepository(
      user.github.accessToken,
      owner,
      repo
    );
    const projectType = detectProjectType(analysis);

    res.json({ analysis, suggestedType: projectType });
  } catch (error) {
    console.error('Analyze repo error:', error);
    res.status(500).json({ message: 'Failed to analyze repository' });
  }
};

// @desc    Import project from GitHub
// @route   POST /api/github/import
// @access  Private
const importFromGitHub = async (req, res) => {
  try {
    const { owner, repo, name, description } = req.body;
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );

    if (!user.github?.accessToken) {
      return res.status(400).json({ message: 'GitHub not connected' });
    }

    // Get repo details
    const repoDetails = await getRepoDetails(
      user.github.accessToken,
      owner,
      repo
    );

    // Analyze the repository
    const analysis = await analyzeRepository(
      user.github.accessToken,
      owner,
      repo
    );
    const projectType = detectProjectType(analysis);

    // Create the project
    const project = await Project.create({
      name: name || repoDetails.name,
      description: description || repoDetails.description || '',
      type: projectType,
      user: req.user._id,
      github: {
        isConnected: true,
        repoId: repoDetails.id,
        repoOwner: owner,
        repoName: repo,
        repoFullName: repoDetails.full_name,
        repoUrl: repoDetails.html_url,
        branch: repoDetails.default_branch || 'main',
        analysis: analysis,
        lastSyncedAt: new Date(),
      },
      phases: [],
    });

    // Populate and return
    const populatedProject = await Project.findById(project._id)
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email');

    res.status(201).json({ project: populatedProject });
  } catch (error) {
    console.error('Import from GitHub error:', error);
    res.status(500).json({ message: 'Failed to import project' });
  }
};

// @desc    Connect existing project to a repository
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

    // Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership or collaborator access
    if (project.user.toString() !== req.user._id.toString()) {
      const isCollaborator = project.collaborators?.some(
        (c) =>
          c.user.toString() === req.user._id.toString() && c.role !== 'viewer'
      );
      if (!isCollaborator) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    // Get repo details
    const repoDetails = await getRepoDetails(
      user.github.accessToken,
      owner,
      repo
    );

    // Analyze the repository
    const analysis = await analyzeRepository(
      user.github.accessToken,
      owner,
      repo
    );

    // Update project with GitHub info
    project.github = {
      isConnected: true,
      repoId: repoDetails.id,
      repoOwner: owner,
      repoName: repo,
      repoFullName: repoDetails.full_name,
      repoUrl: repoDetails.html_url,
      branch: repoDetails.default_branch || 'main',
      analysis: analysis,
      lastSyncedAt: new Date(),
    };

    await project.save();

    // Return the updated project
    const updatedProject = await Project.findById(projectId)
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email');

    res.json({
      message: 'Repository connected successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Connect project to repo error:', error);
    res.status(500).json({ message: 'Failed to connect repository' });
  }
};

// @desc    Create GitHub repo from project
// @route   POST /api/github/create-repo/:projectId
// @access  Private
const createRepoFromProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { isPrivate = true } = req.body;

    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );

    if (!user.github?.accessToken) {
      return res.status(400).json({ message: 'GitHub not connected' });
    }

    // Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership
    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Only project owner can create repository' });
    }

    // Create repo name (sanitize project name)
    const repoName =
      project.name
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100) || 'my-project';

    // Create the repository
    const newRepo = await createRepo(
      user.github.accessToken,
      repoName,
      project.description || `Project: ${project.name}`,
      isPrivate
    );

    // Create initial README with project info
    const readmeContent = generateReadmeContent(project);

    try {
      await createOrUpdateFile(
        user.github.accessToken,
        newRepo.owner.login,
        newRepo.name,
        'README.md',
        readmeContent,
        'Initial commit: Project setup from ProjectFlow'
      );
    } catch (readmeError) {
      console.log('README update note:', readmeError.message);
      // Continue even if README fails - repo was still created
    }

    // Update project with GitHub info
    project.github = {
      isConnected: true,
      repoId: newRepo.id,
      repoOwner: newRepo.owner.login,
      repoName: newRepo.name,
      repoFullName: newRepo.full_name,
      repoUrl: newRepo.html_url,
      branch: newRepo.default_branch || 'main',
      analysis: {
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
          hasReadme: true,
        },
        files: { total: 1, byExtension: { md: 1 } },
        detectedFeatures: [],
        missingFeatures: [],
        suggestions: ['Start building your project!'],
      },
      lastSyncedAt: new Date(),
    };

    await project.save();

    // Return the updated project
    const updatedProject = await Project.findById(projectId)
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email');

    res.json({
      message: 'Repository created successfully',
      project: updatedProject,
      repoUrl: newRepo.html_url,
    });
  } catch (error) {
    console.error('Create repo error:', error);

    // Handle specific GitHub errors
    if (error.status === 422) {
      return res.status(400).json({
        message: 'Repository name already exists. Try renaming your project.',
      });
    }

    res.status(500).json({ message: 'Failed to create repository' });
  }
};

// @desc    Get project commits
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

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.github?.isConnected) {
      return res.json([]); // Return empty array if no repo connected
    }

    const commits = await getRecentCommits(
      user.github.accessToken,
      project.github.repoOwner,
      project.github.repoName,
      10
    );

    res.json(commits);
  } catch (error) {
    console.error('Get commits error:', error);
    // Return empty array instead of error for better UX
    res.json([]);
  }
};

// @desc    Sync project with GitHub repo
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

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.github?.isConnected) {
      return res
        .status(400)
        .json({ message: 'Project not connected to GitHub' });
    }

    // Re-analyze the repository
    const analysis = await analyzeRepository(
      user.github.accessToken,
      project.github.repoOwner,
      project.github.repoName
    );

    // Update project with new analysis
    project.github.analysis = analysis;
    project.github.lastSyncedAt = new Date();

    await project.save();

    // Return the updated project
    const updatedProject = await Project.findById(projectId)
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email');

    res.json({
      message: 'Project synced successfully',
      project: updatedProject,
      analysis,
    });
  } catch (error) {
    console.error('Sync project error:', error);
    res.status(500).json({ message: 'Failed to sync project' });
  }
};

// Helper function to generate README content
function generateReadmeContent(project) {
  const phases = project.phases || [];

  let content = `# ${project.name}\n\n`;

  if (project.description) {
    content += `${project.description}\n\n`;
  }

  content += `## Project Info\n\n`;
  content += `- **Type:** ${project.type}\n`;
  content += `- **Created:** ${new Date(
    project.createdAt
  ).toLocaleDateString()}\n`;
  content += `- **Progress:** ${project.progress || 0}%\n`;
  content += `- **Managed with:** [ProjectFlow](https://projectflowww.netlify.app)\n\n`;

  if (phases.length > 0) {
    content += `## Development Phases\n\n`;
    phases.forEach((phase, index) => {
      const status = phase.isComplete ? '✅' : '⬜';
      content += `### ${status} Phase ${index + 1}: ${phase.title}\n\n`;

      if (phase.description) {
        content += `${phase.description}\n\n`;
      }

      if (phase.subTasks && phase.subTasks.length > 0) {
        content += `**Tasks:**\n`;
        phase.subTasks.forEach((task) => {
          const taskStatus = task.isComplete ? '✅' : '⬜';
          content += `- ${taskStatus} ${task.title}\n`;
        });
        content += '\n';
      }
    });
  }

  content += `---\n\n`;
  content += `## Getting Started\n\n`;
  content += `\`\`\`bash\n`;
  content += `# Clone the repository\n`;
  content += `git clone <repo-url>\n\n`;
  content += `# Install dependencies\n`;
  content += `npm install\n\n`;
  content += `# Start development\n`;
  content += `npm run dev\n`;
  content += `\`\`\`\n\n`;
  content += `---\n\n`;
  content += `*This project is tracked with [ProjectFlow](https://projectflowww.netlify.app) - AI-Powered Project Management*\n`;

  return content;
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
