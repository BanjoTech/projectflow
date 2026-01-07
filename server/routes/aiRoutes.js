// server/routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const {
  suggestPhaseSubtasks,
  chat,
  generatePhases,
  generateProjectPlanningPRD,
  generateProjectDocumentationPRD,
  getProjectPRDs,
} = require('../controllers/aiController');
const protect = require('../middleware/auth');

router.use(protect);

// Existing
router.post('/suggest-subtasks', suggestPhaseSubtasks);
router.post('/chat', chat);

// NEW: Phase generation
router.post('/generate-phases', generatePhases);

// NEW: PRD endpoints
router.post('/generate-planning-prd/:projectId', generateProjectPlanningPRD);
router.post(
  '/generate-documentation-prd/:projectId',
  generateProjectDocumentationPRD
);
router.get('/prds/:projectId', getProjectPRDs);

module.exports = router;
