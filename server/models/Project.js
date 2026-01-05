// server/models/Project.js

const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});

const phaseSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  subTasks: [subTaskSchema],
  notes: {
    type: String,
    default: '',
  },
});

// Collaborator schema
const collaboratorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['owner', 'editor', 'viewer'],
    default: 'editor',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Chat message schema for AI assistant
const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: true,
      enum: [
        'landing-page',
        'portfolio',
        'spa',
        'fullstack',
        'saas',
        'ecommerce',
        'mobile-app',
        'api',
        'custom',
      ],
    },
    phases: [phaseSchema],
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Collaboration
    collaborators: [collaboratorSchema],
    isPublic: {
      type: Boolean,
      default: false,
    },
    inviteCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    // AI Chat History
    chatHistory: [chatMessageSchema],
  },
  {
    timestamps: true,
  }
);

// Generate unique invite code
projectSchema.methods.generateInviteCode = function () {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  this.inviteCode = code;
  return code;
};

// Calculate progress
projectSchema.methods.calculateProgress = function () {
  if (this.phases.length === 0) return 0;

  const completedPhases = this.phases.filter(
    (phase) => phase.isComplete
  ).length;
  const totalPhases = this.phases.length;

  this.progress = Math.round((completedPhases / totalPhases) * 100);

  if (this.progress === 100) {
    this.status = 'completed';
  } else {
    this.status = 'active';
  }

  return this.progress;
};

// Check if user can access project
projectSchema.methods.canAccess = function (userId) {
  const userIdStr = userId.toString();

  // Owner can always access
  if (this.user.toString() === userIdStr) return true;

  // Check collaborators
  const collaborator = this.collaborators.find(
    (c) => c.user.toString() === userIdStr
  );

  return !!collaborator;
};

// Check if user can edit project
projectSchema.methods.canEdit = function (userId) {
  const userIdStr = userId.toString();

  // Owner can always edit
  if (this.user.toString() === userIdStr) return true;

  // Check collaborators with editor role
  const collaborator = this.collaborators.find(
    (c) => c.user.toString() === userIdStr && c.role !== 'viewer'
  );

  return !!collaborator;
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
