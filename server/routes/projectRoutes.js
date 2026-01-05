// server/routes/projectRoutes.js

const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updatePhase,
  addCollaborator,
  removeCollaborator,
  joinProject,
  saveChatMessage,
  clearChatHistory,
} = require('../controllers/projectController');
const protect = require('../middleware/auth');

router.use(protect);

router.route('/').get(getProjects).post(createProject);

router.post('/join/:code', joinProject);

router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

router.put('/:id/phases/:phaseId', updatePhase);

router.route('/:id/collaborators').post(addCollaborator);

router.delete('/:id/collaborators/:userId', removeCollaborator);

router.route('/:id/chat').post(saveChatMessage).delete(clearChatHistory);

module.exports = router;
