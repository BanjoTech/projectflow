// client/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH API
export const authAPI = {
  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  verifyEmail: async (token) => {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
  },
  resendVerification: async () => {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  },
};

// PROJECTS API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  update: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
  updatePhase: async (projectId, phaseId, phaseData) => {
    const response = await api.put(
      `/projects/${projectId}/phases/${phaseId}`,
      phaseData
    );
    return response.data;
  },
  // Phase management
  addPhase: async (projectId, data) => {
    const response = await api.post(`/projects/${projectId}/phases`, data);
    return response.data;
  },
  deletePhase: async (projectId, phaseId) => {
    const response = await api.delete(
      `/projects/${projectId}/phases/${phaseId}`
    );
    return response.data;
  },
  reorderPhases: async (projectId, phaseIds) => {
    const response = await api.put(`/projects/${projectId}/phases/reorder`, {
      phaseIds,
    });
    return response.data;
  },
  // Task management
  addTask: async (projectId, phaseId, data) => {
    const response = await api.post(
      `/projects/${projectId}/phases/${phaseId}/tasks`,
      data
    );
    return response.data;
  },
  updateTask: async (projectId, phaseId, taskId, data) => {
    const response = await api.put(
      `/projects/${projectId}/phases/${phaseId}/tasks/${taskId}`,
      data
    );
    return response.data;
  },
  deleteTask: async (projectId, phaseId, taskId) => {
    const response = await api.delete(
      `/projects/${projectId}/phases/${phaseId}/tasks/${taskId}`
    );
    return response.data;
  },
  // Collaborators
  addCollaborator: async (projectId, email, role) => {
    const response = await api.post(`/projects/${projectId}/collaborators`, {
      email,
      role,
    });
    return response.data;
  },
  removeCollaborator: async (projectId, userId) => {
    const response = await api.delete(
      `/projects/${projectId}/collaborators/${userId}`
    );
    return response.data;
  },
  joinProject: async (code) => {
    const response = await api.post(`/projects/join/${code}`);
    return response.data;
  },
  saveChatMessage: async (projectId, role, content) => {
    const response = await api.post(`/projects/${projectId}/chat`, {
      role,
      content,
    });
    return response.data;
  },
  clearChatHistory: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}/chat`);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  suggestSubtasks: async (projectId, phaseId) => {
    const response = await api.post('/ai/suggest-subtasks', {
      projectId,
      phaseId,
    });
    return response.data;
  },
  chat: async (projectId, message, chatHistory, currentPhaseId = null) => {
    const response = await api.post('/ai/chat', {
      projectId,
      message,
      chatHistory,
      currentPhaseId,
    });
    return response.data;
  },
  generatePhases: async (name, description, type, template = null) => {
    const response = await api.post('/ai/generate-phases', {
      name,
      description,
      type,
      template,
    });
    return response.data;
  },
  generatePlanningPRD: async (projectId) => {
    const response = await api.post(`/ai/generate-planning-prd/${projectId}`);
    return response.data;
  },
  generateDocumentationPRD: async (projectId) => {
    const response = await api.post(
      `/ai/generate-documentation-prd/${projectId}`
    );
    return response.data;
  },
  getProjectPRDs: async (projectId) => {
    const response = await api.get(`/ai/prds/${projectId}`);
    return response.data;
  },
};

// NOTIFICATIONS API
export const notificationsAPI = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
  clearAll: async () => {
    const response = await api.delete('/notifications/clear-all');
    return response.data;
  },
};

// GITHUB API - COMPLETE
export const githubAPI = {
  // OAuth
  getAuthUrl: async () => {
    const response = await api.get('/github/auth-url');
    return response.data;
  },
  handleCallback: async (code) => {
    const response = await api.post('/github/callback', { code });
    return response.data;
  },
  disconnect: async () => {
    const response = await api.delete('/github/disconnect');
    return response.data;
  },
  getStatus: async () => {
    const response = await api.get('/github/status');
    return response.data;
  },

  // Repositories
  getRepos: async (page = 1) => {
    const response = await api.get(`/github/repos?page=${page}`);
    return response.data;
  },
  analyzeRepo: async (owner, repo) => {
    const response = await api.post('/github/analyze', { owner, repo });
    return response.data;
  },

  // Project Integration
  importProject: async (data) => {
    const response = await api.post('/github/import', data);
    return response.data;
  },
  connectProject: async (projectId, owner, repo) => {
    const response = await api.post(`/github/connect/${projectId}`, {
      owner,
      repo,
    });
    return response.data;
  },
  disconnectRepo: async (projectId) => {
    const response = await api.delete(`/github/disconnect/${projectId}`);
    return response.data;
  },
  createRepo: async (projectId, isPrivate) => {
    const response = await api.post(`/github/create-repo/${projectId}`, {
      isPrivate,
    });
    return response.data;
  },

  // Project Data
  getCommits: async (projectId) => {
    const response = await api.get(`/github/commits/${projectId}`);
    return response.data;
  },
  syncProject: async (projectId) => {
    const response = await api.post(`/github/sync/${projectId}`);
    return response.data;
  },

  // File Browser
  getFileTree: async (projectId) => {
    const response = await api.get(`/github/files/${projectId}`);
    return response.data;
  },
  getFileContent: async (projectId, path) => {
    const response = await api.get(
      `/github/file/${projectId}?path=${encodeURIComponent(path)}`
    );
    return response.data;
  },
  explainFile: async (projectId, path) => {
    const response = await api.get(
      `/github/explain/${projectId}?path=${encodeURIComponent(path)}`
    );
    return response.data;
  },

  // Git Data
  getBranches: async (projectId) => {
    const response = await api.get(`/github/branches/${projectId}`);
    return response.data;
  },
  getPullRequests: async (projectId) => {
    const response = await api.get(`/github/pulls/${projectId}`);
    return response.data;
  },
  getIssues: async (projectId) => {
    const response = await api.get(`/github/issues/${projectId}`);
    return response.data;
  },
  getContributors: async (projectId) => {
    const response = await api.get(`/github/contributors/${projectId}`);
    return response.data;
  },

  // Task Comparison
  compareWithCode: async (projectId) => {
    const response = await api.get(`/github/compare/${projectId}`);
    return response.data;
  },
};

export default api;
