// client/src/services/socket.js

import { io } from 'socket.io-client';

// Use environment variable for production, fallback to localhost for development
// Strips '/api' from the URL because Socket.io connects to the base server
const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket = null;

export const connectSocket = (userId) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    if (userId) {
      socket.emit('join-user', userId);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const joinProject = (projectId) => {
  if (socket?.connected) {
    socket.emit('join-project', projectId);
    console.log('Joined project room:', projectId);
  }
};

export const leaveProject = (projectId) => {
  if (socket?.connected) {
    socket.emit('leave-project', projectId);
    console.log('Left project room:', projectId);
  }
};

// Subscribe to project events
export const onProjectUpdate = (callback) => {
  if (socket) {
    socket.on('project-updated', callback);
  }
};

export const onPhaseUpdate = (callback) => {
  if (socket) {
    socket.on('phase-updated', callback);
  }
};

export const onProjectDeleted = (callback) => {
  if (socket) {
    socket.on('project-deleted', callback);
  }
};

export const onNotification = (callback) => {
  if (socket) {
    socket.on('notification', callback);
  }
};

// Remove listeners
export const offProjectUpdate = (callback) => {
  if (socket) {
    socket.off('project-updated', callback);
  }
};

export const offPhaseUpdate = (callback) => {
  if (socket) {
    socket.off('phase-updated', callback);
  }
};

export const offProjectDeleted = (callback) => {
  if (socket) {
    socket.off('project-deleted', callback);
  }
};

export const offNotification = (callback) => {
  if (socket) {
    socket.off('notification', callback);
  }
};
