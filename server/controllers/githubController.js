// server/controllers/githubController.js

const axios = require('axios');
const User = require('../models/User');
const Project = require('../models/Project');
// We don't import Octokit here directly, we use the service
const {
  getGitHubUser,
  getUserRepos,
  getRepoDetails,
  createRepo,
  analyzeRepository,
  generatePhasesFromRepo,
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
const disconnectGitHub = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { github: 1 } });
    res.json({ message: 'GitHub disconnected' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to disconnect' });
  }
};

// @desc    Get GitHub connection status
const getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );
    if (!user.github?.accessToken) return res.json({ connected: false });

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

// @desc    Get repos
const getRepos = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      '+github.accessToken'
    );
    if (!user.github?.accessToken)
      return res.status(400).json({ message: 'Not connected' });

    const repos = await getUserRepos(user.github.accessToken);
    res.json(
      repos.map((r) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        isPrivate: r.private,
        url: r.html_url,
      }))
    );
  } catch (error) {
    console.error('Get repos error:', error);
    res.status(500).json({ message: 'Failed to fetch repos' });
  }
};

// @desc    Import Project
const importFromGitHub = async (req, res) => {
  // Stub for now to prevent crash if not fully implemented in service
  res
    .status(501)
    .json({ message: 'Import logic needs full service implementation' });
};

// Placeholder exports for routes to work
const analyzeRepo = async (req, res) => res.json({});
const connectProjectToRepo = async (req, res) => res.json({});
const createRepoFromProject = async (req, res) => res.json({});
const getProjectCommits = async (req, res) => res.json([]);
const syncProject = async (req, res) => res.json({});

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
