// server/controllers/githubController.js

const axios = require('axios');
const User = require('../models/User');
const Project = require('../models/Project');
const {
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
  analyzeRepository,
  detectProjectType,
  compareTasksWithCode,
  explainFile,
} = require('../services/githubService');

// Helper to get user's GitHub token
async function getUserToken(userId) {
  const user = await User.findById(userId).select('+github.accessToken');
  return user?.github?.accessToken;
}

// @desc    Get GitHub OAuth URL
// @route   GET /api/github/auth-url
// @access  Private
const getAuthUrl = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    if (!clientId || !redirectUri) {
      return res.status(500).json({ message: 'GitHub not configured' });
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

    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token, error, error_description } = tokenResponse.data;

    if (error || !access_token) {
      return res
        .status(400)
        .json({ message: error_description || 'OAuth failed' });
    }

    const githubUser = await getGitHubUser(access_token);

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
    const token = await getUserToken(req.user._id);

    if (!token) {
      return res.json({ connected: false });
    }

    try {
      const githubUser = await getGitHubUser(token);
      res.json({
        connected: true,
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
      });
    } catch {
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
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const repos = await getUserRepos(token);

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
        language: r.language,
        stars: r.stargazers_count,
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
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const analysis = await analyzeRepository(token, owner, repo);
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
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const repoDetails = await getRepoDetails(token, owner, repo);
    const analysis = await analyzeRepository(token, owner, repo);
    const projectType = detectProjectType(analysis);

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

    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.canEdit(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const repoDetails = await getRepoDetails(token, owner, repo);
    const analysis = await analyzeRepository(token, owner, repo);

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

    const updatedProject = await Project.findById(projectId)
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email');

    res.json({ message: 'Repository connected', project: updatedProject });
  } catch (error) {
    console.error('Connect project to repo error:', error);
    res.status(500).json({ message: 'Failed to connect repository' });
  }
};

// @desc    Disconnect repository from project
// @route   DELETE /api/github/disconnect/:projectId
// @access  Private
const disconnectProjectRepo = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.canEdit(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project.github = {
      isConnected: false,
    };

    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email');

    res.json({ message: 'Repository disconnected', project: updatedProject });
  } catch (error) {
    console.error('Disconnect repo error:', error);
    res.status(500).json({ message: 'Failed to disconnect repository' });
  }
};

// @desc    Create GitHub repo from project
// @route   POST /api/github/create-repo/:projectId
// @access  Private
const createRepoFromProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { isPrivate = true } = req.body;

    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Only owner can create repository' });
    }

    const repoName =
      project.name
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100) || 'my-project';

    const newRepo = await createRepo(
      token,
      repoName,
      project.description || `Project: ${project.name}`,
      isPrivate
    );

    const readmeContent = generateReadmeContent(project);

    try {
      await createOrUpdateFile(
        token,
        newRepo.owner.login,
        newRepo.name,
        'README.md',
        readmeContent,
        'Initial commit: Project setup from ProjectFlow'
      );
    } catch (e) {
      console.log('README note:', e.message);
    }

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
          devops: [],
          other: [],
        },
        structure: { hasReadme: true },
        files: { total: 1, byExtension: { md: 1 } },
        detectedFeatures: [],
        missingFeatures: [],
        suggestions: ['Start building your project!'],
        codeQuality: {
          score: 0,
          grade: 'N/A',
          details: {},
          recommendations: [],
        },
        designPatterns: {
          primary: 'unknown',
          patterns: [],
          description: 'Not enough code to analyze yet.',
        },
        architecture: {
          style: 'unknown',
          layers: [],
          description: 'Architecture will be detected as code is added.',
        },
      },
      lastSyncedAt: new Date(),
    };

    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email');

    res.json({
      message: 'Repository created',
      project: updatedProject,
      repoUrl: newRepo.html_url,
    });
  } catch (error) {
    console.error('Create repo error:', error);
    if (error.status === 422) {
      return res
        .status(400)
        .json({ message: 'Repository name already exists' });
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
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project || !project.github?.isConnected) {
      return res.json([]);
    }

    const commits = await getRecentCommits(
      token,
      project.github.repoOwner,
      project.github.repoName,
      15
    );

    res.json(commits);
  } catch (error) {
    console.error('Get commits error:', error);
    res.json([]);
  }
};

// @desc    Sync project with GitHub repo
// @route   POST /api/github/sync/:projectId
// @access  Private
const syncProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project || !project.github?.isConnected) {
      return res
        .status(400)
        .json({ message: 'Project not connected to GitHub' });
    }

    const analysis = await analyzeRepository(
      token,
      project.github.repoOwner,
      project.github.repoName
    );

    project.github.analysis = analysis;
    project.github.lastSyncedAt = new Date();
    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email');

    res.json({ message: 'Project synced', project: updatedProject, analysis });
  } catch (error) {
    console.error('Sync project error:', error);
    res.status(500).json({ message: 'Failed to sync project' });
  }
};

// @desc    Get file tree
// @route   GET /api/github/files/:projectId
// @access  Private
const getFileTree = async (req, res) => {
  try {
    const { projectId } = req.params;
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project || !project.github?.isConnected) {
      return res.status(400).json({ message: 'No repository connected' });
    }

    const tree = await getRepoTree(
      token,
      project.github.repoOwner,
      project.github.repoName,
      project.github.branch
    );

    const fileTree = buildFileTree(tree);
    res.json(fileTree);
  } catch (error) {
    console.error('Get file tree error:', error);
    res.status(500).json({ message: 'Failed to get file tree' });
  }
};

// @desc    Get file content
// @route   GET /api/github/file/:projectId
// @access  Private
const getFile = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { path } = req.query;

    if (!path) return res.status(400).json({ message: 'Path is required' });

    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project || !project.github?.isConnected) {
      return res.status(400).json({ message: 'No repository connected' });
    }

    const fileData = await getFileContent(
      token,
      project.github.repoOwner,
      project.github.repoName,
      path,
      project.github.branch
    );

    if (!fileData) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(fileData);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Failed to get file' });
  }
};

// @desc    Explain file content
// @route   GET /api/github/explain/:projectId
// @access  Private
const explainFileContent = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { path } = req.query;

    if (!path) return res.status(400).json({ message: 'Path is required' });

    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project || !project.github?.isConnected) {
      return res.status(400).json({ message: 'No repository connected' });
    }

    const explanation = await explainFile(
      token,
      project.github.repoOwner,
      project.github.repoName,
      path
    );

    res.json(explanation);
  } catch (error) {
    console.error('Explain file error:', error);
    res.status(500).json({ message: 'Failed to explain file' });
  }
};

// @desc    Get branches
// @route   GET /api/github/branches/:projectId
// @access  Private
const getProjectBranches = async (req, res) => {
  try {
    const { projectId } = req.params;
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project || !project.github?.isConnected) {
      return res.json([]);
    }

    const branches = await getBranches(
      token,
      project.github.repoOwner,
      project.github.repoName
    );

    res.json(branches);
  } catch (error) {
    console.error('Get branches error:', error);
    res.json([]);
  }
};

// @desc    Get pull requests
// @route   GET /api/github/pulls/:projectId
// @access  Private
const getProjectPulls = async (req, res) => {
  try {
    const { projectId } = req.params;
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project || !project.github?.isConnected) {
      return res.json([]);
    }

    const pulls = await getPullRequests(
      token,
      project.github.repoOwner,
      project.github.repoName
    );

    res.json(pulls);
  } catch (error) {
    console.error('Get PRs error:', error);
    res.json([]);
  }
};

// @desc    Get issues
// @route   GET /api/github/issues/:projectId
// @access  Private
const getProjectIssues = async (req, res) => {
  try {
    const { projectId } = req.params;
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project || !project.github?.isConnected) {
      return res.json([]);
    }

    const issues = await getIssues(
      token,
      project.github.repoOwner,
      project.github.repoName
    );

    res.json(issues);
  } catch (error) {
    console.error('Get issues error:', error);
    res.json([]);
  }
};

// @desc    Get contributors
// @route   GET /api/github/contributors/:projectId
// @access  Private
const getProjectContributors = async (req, res) => {
  try {
    const { projectId } = req.params;
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project || !project.github?.isConnected) {
      return res.json([]);
    }

    const contributors = await getContributors(
      token,
      project.github.repoOwner,
      project.github.repoName
    );

    res.json(contributors);
  } catch (error) {
    console.error('Get contributors error:', error);
    res.json([]);
  }
};

// @desc    Compare tasks with code
// @route   GET /api/github/compare/:projectId
// @access  Private
const compareWithCode = async (req, res) => {
  try {
    const { projectId } = req.params;
    const token = await getUserToken(req.user._id);
    if (!token)
      return res.status(400).json({ message: 'GitHub not connected' });

    const project = await Project.findById(projectId);
    if (!project || !project.github?.isConnected) {
      return res.status(400).json({ message: 'No repository connected' });
    }

    const comparison = await compareTasksWithCode(
      token,
      project.github.repoOwner,
      project.github.repoName,
      project.phases
    );

    // Cache the comparison
    project.github.taskComparison = comparison;
    project.github.taskComparisonUpdatedAt = new Date();
    await project.save();

    res.json(comparison);
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({ message: 'Failed to compare' });
  }
};

// Helper: Build file tree from flat array
function buildFileTree(files) {
  const root = { name: 'root', type: 'dir', children: [] };

  files.forEach((file) => {
    const parts = file.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      let child = current.children.find((c) => c.name === part);

      if (!child) {
        child = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: isLast ? file.type : 'tree',
          size: isLast ? file.size : undefined,
          children: isLast && file.type === 'blob' ? undefined : [],
        };
        current.children.push(child);
      }

      if (!isLast) {
        current = child;
      }
    });
  });

  // Sort: folders first, then files, alphabetically
  const sortChildren = (node) => {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type === 'tree' && b.type !== 'tree') return -1;
        if (a.type !== 'tree' && b.type === 'tree') return 1;
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortChildren);
    }
  };
  sortChildren(root);

  return root.children;
}

// Helper: Generate README content
function generateReadmeContent(project) {
  const phases = project.phases || [];

  let content = `# ${project.name}\n\n`;
  if (project.description) content += `${project.description}\n\n`;

  content += `## Project Info\n\n`;
  content += `- **Type:** ${project.type}\n`;
  content += `- **Progress:** ${project.progress || 0}%\n`;
  content += `- **Managed with:** [ProjectFlow](https://projectflowww.netlify.app)\n\n`;

  if (phases.length > 0) {
    content += `## Development Phases\n\n`;
    phases.forEach((phase, i) => {
      const status = phase.isComplete ? '✅' : '⬜';
      content += `### ${status} Phase ${i + 1}: ${phase.title}\n\n`;
      if (phase.description) content += `${phase.description}\n\n`;
      if (phase.subTasks?.length > 0) {
        phase.subTasks.forEach((task) => {
          content += `- ${task.isComplete ? '✅' : '⬜'} ${task.title}\n`;
        });
        content += '\n';
      }
    });
  }

  content += `---\n*Tracked with [ProjectFlow](https://projectflowww.netlify.app)*\n`;
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
  disconnectProjectRepo,
  createRepoFromProject,
  getProjectCommits,
  syncProject,
  getFileTree,
  getFile,
  explainFileContent,
  getProjectBranches,
  getProjectPulls,
  getProjectIssues,
  getProjectContributors,
  compareWithCode,
};
