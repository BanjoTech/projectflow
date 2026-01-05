// server/routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const { suggestPhaseSubtasks, chat } = require('../controllers/aiController');
const protect = require('../middleware/auth');

router.use(protect);

router.post('/suggest-subtasks', suggestPhaseSubtasks);
router.post('/chat', chat);

module.exports = router;
