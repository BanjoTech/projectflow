// server/routes/authRoutes.js
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const protect = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;

/*
EXPLANATION:

router = mini Express app that handles a group of routes
- router.post('/signup', signup) means:
  POST request to /signup → run signup controller

- protect middleware runs BEFORE getMe
  It checks the token, then calls next() to run getMe
*/
