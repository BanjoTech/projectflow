// server/routes/githubRoutes.js

const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/githubController');
const protect = require('../middleware/auth');

router.use(protect);

// OAuth
router.get('/auth-url', getAuthUrl);
router.post('/callback', handleCallback);
router.delete('/disconnect', disconnectGitHub);
router.get('/status', getStatus);

// Repositories
router.get('/repos', getRepos);
router.post('/analyze', analyzeRepo);

// Project Integration
router.post('/import', importFromGitHub);
router.post('/connect/:projectId', connectProjectToRepo);
router.post('/create-repo/:projectId', createRepoFromProject);
router.get('/commits/:projectId', getProjectCommits);
router.post('/sync/:projectId', syncProject);

module.exports = router;
