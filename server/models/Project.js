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
  description: {
    type: String,
    default: '',
  },
  completedAt: {
    type: Date,
    default: null,
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
        'web3', // NEW
        'animated', // NEW
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
    // Metadata from AI generation
    metadata: {
      estimatedDuration: String,
      complexity: String,
    },
    // PRD storage
    planningPRD: {
      type: String,
      default: null,
    },
    planningPRDGeneratedAt: {
      type: Date,
      default: null,
    },
    documentationPRD: {
      type: String,
      default: null,
    },
    documentationPRDGeneratedAt: {
      type: Date,
      default: null,
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

    // GitHub Integration
    github: {
      repoId: Number,
      repoName: String,
      repoFullName: String,
      repoUrl: String,
      defaultBranch: String,
      isConnected: {
        type: Boolean,
        default: false,
      },
      lastSyncedAt: Date,
      analysis: {
        techStack: mongoose.Schema.Types.Mixed,
        structure: mongoose.Schema.Types.Mixed,
        detectedFeatures: [String],
        missingFeatures: [String],
      },
    },
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

// Calculate progress based on completed tasks
projectSchema.methods.calculateProgress = function () {
  let totalTasks = 0;
  let completedTasks = 0;

  this.phases.forEach((phase) => {
    totalTasks += phase.subTasks.length;
    completedTasks += phase.subTasks.filter((t) => t.isComplete).length;
  });

  if (totalTasks === 0) {
    this.progress = 0;
  } else {
    this.progress = Math.round((completedTasks / totalTasks) * 100);
  }

  if (this.progress === 100) {
    this.status = 'completed';
  } else if (this.progress > 0) {
    this.status = 'active';
  }

  return this.progress;
};

// Check if user can access project
projectSchema.methods.canAccess = function (userId) {
  const userIdStr = userId.toString();
  if (this.user.toString() === userIdStr) return true;
  const collaborator = this.collaborators.find(
    (c) => c.user.toString() === userIdStr
  );
  return !!collaborator;
};

// Check if user can edit project
projectSchema.methods.canEdit = function (userId) {
  const userIdStr = userId.toString();
  if (this.user.toString() === userIdStr) return true;
  const collaborator = this.collaborators.find(
    (c) => c.user.toString() === userIdStr && c.role !== 'viewer'
  );
  return !!collaborator;
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
