// server/controllers/projectController.js

const Project = require('../models/Project');
const User = require('../models/User');
const { getPhaseTemplate } = require('../utils/phaseTemplates');
const { notifyProjectMembers } = require('../services/notificationService');

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ user: req.user._id }, { 'collaborators.user': req.user._id }],
    })
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email')
      .sort({ updatedAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('getProjects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }

    const project = await Project.findById(req.params.id)
      .populate('user', 'name email')
      .populate('collaborators.user', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const projectOwnerId = project.user._id
      ? project.user._id.toString()
      : project.user.toString();

    const isOwner = projectOwnerId === userId;
    const isCollaborator = project.collaborators?.some(
      (c) => (c.user._id ? c.user._id.toString() : c.user.toString()) === userId
    );

    if (!isOwner && !isCollaborator) {
      return res
        .status(401)
        .json({ message: 'Not authorized to access this project' });
    }

    res.json(project);
  } catch (error) {
    console.error('getProject error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new project (NO AI - uses templates)
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    // Use developer-focused template phases
    const phases = getPhaseTemplate(type);

    const project = await Project.create({
      user: req.user._id,
      name,
      description,
      type,
      phases,
    });

    project.generateInviteCode();
    await project.save();
    await project.populate('user', 'name email');

    res.status(201).json(project);
  } catch (error) {
    console.error('createProject error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const projectOwnerId = project.user.toString();
    const isOwner = projectOwnerId === userId;
    const canEdit =
      isOwner ||
      project.collaborators?.some(
        (c) => c.user.toString() === userId && c.role !== 'viewer'
      );

    if (!canEdit) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, description } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();
    await project.populate('user', 'name email');
    await project.populate('collaborators.user', 'name email');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`project:${project._id}`).emit('project-updated', project);

    res.json(project);
  } catch (error) {
    console.error('updateProject error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (owner only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'Only the owner can delete this project' });
    }

    await Project.deleteOne({ _id: req.params.id });

    // Emit real-time deletion
    const io = req.app.get('io');
    io.to(`project:${project._id}`).emit('project-deleted', {
      projectId: project._id,
    });

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('deleteProject error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a phase in a project
// @route   PUT /api/projects/:id/phases/:phaseId
// @access  Private
const updatePhase = async (req, res) => {
  try {
    const { id, phaseId } = req.params;
    const { isComplete, notes, subTasks } = req.body;

    let project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const projectOwnerId = project.user.toString();
    const isOwner = projectOwnerId === userId;
    const canEdit =
      isOwner ||
      project.collaborators?.some(
        (c) => c.user.toString() === userId && c.role !== 'viewer'
      );

    if (!canEdit) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const phaseIndex = project.phases.findIndex(
      (p) => p.id === parseInt(phaseId)
    );

    if (phaseIndex === -1) {
      return res.status(404).json({ message: 'Phase not found' });
    }

    const previousPhaseComplete = project.phases[phaseIndex].isComplete;
    let phaseJustCompleted = false;
    let taskJustCompleted = false;

    if (typeof isComplete === 'boolean') {
      project.phases[phaseIndex].isComplete = isComplete;
      project.phases[phaseIndex].completedAt = isComplete ? new Date() : null;

      if (!previousPhaseComplete && isComplete) {
        phaseJustCompleted = true;
      }
    }

    if (notes !== undefined) {
      project.phases[phaseIndex].notes = notes;
    }

    if (subTasks) {
      // Check if any task was just completed
      const oldSubTasks = project.phases[phaseIndex].subTasks;
      subTasks.forEach((newTask, idx) => {
        if (
          oldSubTasks[idx] &&
          !oldSubTasks[idx].isComplete &&
          newTask.isComplete
        ) {
          taskJustCompleted = true;
        }
      });
      project.phases[phaseIndex].subTasks = subTasks;
    }

    project.calculateProgress();
    await project.save();
    await project.populate('user', 'name email');
    await project.populate('collaborators.user', 'name email');

    // Get io and send real-time update
    const io = req.app.get('io');
    io.to(`project:${project._id}`).emit('phase-updated', {
      projectId: project._id,
      project: project,
    });

    // Send notifications
    if (phaseJustCompleted) {
      await notifyProjectMembers(io, {
        project,
        excludeUserId: userId,
        type: 'phase_completed',
        message: `${req.user.name} completed phase "${project.phases[phaseIndex].title}" in ${project.name}`,
        data: {
          phaseId: parseInt(phaseId),
          phaseName: project.phases[phaseIndex].title,
        },
      });
    } else if (taskJustCompleted) {
      await notifyProjectMembers(io, {
        project,
        excludeUserId: userId,
        type: 'task_completed',
        message: `${req.user.name} completed a task in ${project.name}`,
        data: { phaseId: parseInt(phaseId) },
      });
    }

    res.json(project);
  } catch (error) {
    console.error('updatePhase error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add collaborator to project
// @route   POST /api/projects/:id/collaborators
// @access  Private (owner only)
const addCollaborator = async (req, res) => {
  try {
    const { email, role } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'Only the owner can add collaborators' });
    }

    const userToAdd = await User.findOne({ email: email.toLowerCase() });

    if (!userToAdd) {
      return res
        .status(404)
        .json({ message: 'User not found with that email' });
    }

    const existingCollaborator = project.collaborators?.find(
      (c) => c.user.toString() === userToAdd._id.toString()
    );

    if (existingCollaborator) {
      return res
        .status(400)
        .json({ message: 'User is already a collaborator' });
    }

    if (userToAdd._id.toString() === project.user.toString()) {
      return res
        .status(400)
        .json({ message: 'Owner is already part of the project' });
    }

    project.collaborators.push({
      user: userToAdd._id,
      role: role || 'editor',
    });

    await project.save();
    await project.populate('user', 'name email');
    await project.populate('collaborators.user', 'name email');

    // Send notification to added user
    const io = req.app.get('io');
    const { createNotification } = require('../services/notificationService');
    await createNotification(io, {
      userId: userToAdd._id,
      type: 'collaborator_added',
      message: `${req.user.name} added you to project "${project.name}"`,
      projectId: project._id,
      fromUserId: req.user._id,
    });

    res.json(project);
  } catch (error) {
    console.error('addCollaborator error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove collaborator from project
// @route   DELETE /api/projects/:id/collaborators/:userId
// @access  Private (owner only)
const removeCollaborator = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'Only the owner can remove collaborators' });
    }

    project.collaborators = project.collaborators.filter(
      (c) => c.user.toString() !== req.params.userId
    );

    await project.save();
    await project.populate('user', 'name email');
    await project.populate('collaborators.user', 'name email');

    res.json(project);
  } catch (error) {
    console.error('removeCollaborator error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Join project via invite code
// @route   POST /api/projects/join/:code
// @access  Private
const joinProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      inviteCode: req.params.code.toUpperCase(),
    });

    if (!project) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    if (project.user.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: 'You are the owner of this project' });
    }

    const existingCollaborator = project.collaborators?.find(
      (c) => c.user.toString() === req.user._id.toString()
    );

    if (existingCollaborator) {
      return res
        .status(400)
        .json({ message: 'You are already a collaborator' });
    }

    project.collaborators.push({
      user: req.user._id,
      role: 'editor',
    });

    await project.save();
    await project.populate('user', 'name email');
    await project.populate('collaborators.user', 'name email');

    // Notify owner
    const io = req.app.get('io');
    const { createNotification } = require('../services/notificationService');
    await createNotification(io, {
      userId: project.user._id || project.user,
      type: 'collaborator_added',
      message: `${req.user.name} joined your project "${project.name}"`,
      projectId: project._id,
      fromUserId: req.user._id,
    });

    res.json(project);
  } catch (error) {
    console.error('joinProject error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Save chat message
// @route   POST /api/projects/:id/chat
// @access  Private
const saveChatMessage = async (req, res) => {
  try {
    const { role, content } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id.toString();
    const isOwner = project.user.toString() === userId;
    const isCollaborator = project.collaborators?.some(
      (c) => c.user.toString() === userId
    );

    if (!isOwner && !isCollaborator) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    project.chatHistory.push({ role, content });

    if (project.chatHistory.length > 100) {
      project.chatHistory = project.chatHistory.slice(-100);
    }

    await project.save();

    res.json({ success: true });
  } catch (error) {
    console.error('saveChatMessage error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Clear chat history
// @route   DELETE /api/projects/:id/chat
// @access  Private
const clearChatHistory = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.chatHistory = [];
    await project.save();

    res.json({ success: true });
  } catch (error) {
    console.error('clearChatHistory error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};
