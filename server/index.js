// server/index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load env vars FIRST
dotenv.config();

const app = express();
const server = http.createServer(app);

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://projectflowww.netlify.app',
];

// SIMPLE CORS - no complexity
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle OPTIONS preflight
app.options('*', cors());

// Parse JSON
app.use(express.json({ limit: '10mb' }));

// Health check BEFORE database connection
app.get('/', (req, res) => {
  res.json({
    message: 'ProjectFlow API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to database
const connectDB = require('./config/db');
connectDB()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-project', (projectId) => {
    socket.join(`project:${projectId}`);
  });

  socket.on('leave-project', (projectId) => {
    socket.leave(`project:${projectId}`);
  });

  socket.on('join-user', (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes - wrapped in try-catch
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/projects', require('./routes/projectRoutes'));
  app.use('/api/ai', require('./routes/aiRoutes'));
  app.use('/api/notifications', require('./routes/notificationRoutes'));
  app.use('/api/github', require('./routes/githubRoutes'));
  console.log('All routes loaded');
} catch (err) {
  console.error('Error loading routes:', err.message);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handler - IMPORTANT: must have 4 parameters
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  console.error(err.stack);

  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
