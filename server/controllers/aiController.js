// server/controllers/aiController.js

const { suggestSubtasks, chatWithAI } = require('../services/aiService');
const Project = require('../models/Project');

// @desc    Suggest subtasks for a phase
// @route   POST /api/ai/suggest-subtasks
// @access  Private
const suggestPhaseSubtasks = async (req, res) => {
  try {
    const { projectId, phaseId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const phase = project.phases.find((p) => p.id === phaseId);

    if (!phase) {
      return res.status(404).json({ message: 'Phase not found' });
    }

    const suggestions = await suggestSubtasks(
      project.name,
      project.description,
      phase.title,
      phase.subTasks
    );

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggest subtasks error:', error);
    res.status(500).json({
      message: 'Failed to generate suggestions',
      error: error.message,
    });
  }
};

// @desc    Chat with AI about project (context-aware)
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res) => {
  try {
    const { projectId, message, chatHistory, currentPhaseId } = req.body;

    let project = null;
    let currentPhase = null;

    // Only fetch project if projectId is provided
    if (projectId) {
      project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Get current phase if provided
      if (currentPhaseId !== undefined && currentPhaseId !== null) {
        currentPhase = project.phases.find((p) => p.id === currentPhaseId);
      }
    }

    const response = await chatWithAI(
      project?.name || 'Development Project',
      project?.description || '',
      project?.type || 'fullstack',
      chatHistory || [],
      message,
      currentPhase
    );

    res.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      message: 'Failed to get AI response',
      error: error.message,
    });
  }
};

module.exports = {
  suggestPhaseSubtasks,
  chat,
};
