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
router.delete('/disconnect/:projectId', disconnectProjectRepo);
router.post('/create-repo/:projectId', createRepoFromProject);

// Project Data
router.get('/commits/:projectId', getProjectCommits);
router.post('/sync/:projectId', syncProject);
router.get('/files/:projectId', getFileTree);
router.get('/file/:projectId', getFile);
router.get('/explain/:projectId', explainFileContent);
router.get('/branches/:projectId', getProjectBranches);
router.get('/pulls/:projectId', getProjectPulls);
router.get('/issues/:projectId', getProjectIssues);
router.get('/contributors/:projectId', getProjectContributors);
router.get('/compare/:projectId', compareWithCode);

module.exports = router;
