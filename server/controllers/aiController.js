// server/controllers/aiController.js

const {
  suggestSubtasks,
  chatWithAI,
  generateDynamicPhases,
  generatePlanningPRD,
  generateDocumentationPRD,
} = require('../services/aiService');
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

// @desc    Chat with AI about project
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res) => {
  try {
    const { projectId, message, chatHistory, currentPhaseId } = req.body;

    let project = null;
    let currentPhase = null;

    if (projectId) {
      project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

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

// @desc    Generate dynamic phases for a new project
// @route   POST /api/ai/generate-phases
// @access  Private
const generatePhases = async (req, res) => {
  try {
    const { name, description, type, template } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    const result = await generateDynamicPhases(
      name,
      description,
      type,
      template
    );

    res.json(result);
  } catch (error) {
    console.error('Generate phases error:', error);
    res.status(500).json({
      message: 'Failed to generate phases',
      error: error.message,
    });
  }
};

// @desc    Generate Planning PRD
// @route   POST /api/ai/generate-planning-prd/:projectId
// @access  Private
const generateProjectPlanningPRD = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access
    if (!project.canAccess(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const prd = await generatePlanningPRD(project);

    // Save to project
    project.planningPRD = prd;
    project.planningPRDGeneratedAt = new Date();
    await project.save();

    res.json({ prd, generatedAt: project.planningPRDGeneratedAt });
  } catch (error) {
    console.error('Generate planning PRD error:', error);
    res.status(500).json({
      message: 'Failed to generate PRD',
      error: error.message,
    });
  }
};

// @desc    Generate Documentation PRD
// @route   POST /api/ai/generate-documentation-prd/:projectId
// @access  Private
const generateProjectDocumentationPRD = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.canAccess(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const prd = await generateDocumentationPRD(project);

    // Save to project
    project.documentationPRD = prd;
    project.documentationPRDGeneratedAt = new Date();
    await project.save();

    res.json({ prd, generatedAt: project.documentationPRDGeneratedAt });
  } catch (error) {
    console.error('Generate documentation PRD error:', error);
    res.status(500).json({
      message: 'Failed to generate documentation',
      error: error.message,
    });
  }
};

// @desc    Get saved PRDs
// @route   GET /api/ai/prds/:projectId
// @access  Private
const getProjectPRDs = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.canAccess(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json({
      planningPRD: project.planningPRD,
      planningPRDGeneratedAt: project.planningPRDGeneratedAt,
      documentationPRD: project.documentationPRD,
      documentationPRDGeneratedAt: project.documentationPRDGeneratedAt,
    });
  } catch (error) {
    console.error('Get PRDs error:', error);
    res.status(500).json({ message: 'Failed to get PRDs' });
  }
};

module.exports = {
  suggestPhaseSubtasks,
  chat,
  generatePhases,
  generateProjectPlanningPRD,
  generateProjectDocumentationPRD,
  getProjectPRDs,
};
