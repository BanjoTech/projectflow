// server/controllers/authController.js
// ═══════════════════════════════════════════════════════════════
// Handles signup and login logic

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload - data stored in token
    process.env.JWT_SECRET, // Secret key to sign token
    { expiresIn: '30d' } // Token expires in 30 days
  );
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'User with this email already exists',
      });
    }

    // Create user (password will be hashed by pre-save middleware)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    // .select('+password') includes password (normally excluded)
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user._id);

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = { signup, login, getMe };

/*
EXPLANATION:

1. GENERATE TOKEN:
   - jwt.sign() creates a new token
   - First arg: payload (what data to store - user id)
   - Second arg: secret key (to verify token later)
   - Third arg: options (expiration time)

2. SIGNUP FLOW:
   - Check if email already taken
   - Create user (password auto-hashed by model middleware)
   - Generate token
   - Return token + user info (never password!)

3. LOGIN FLOW:
   - Find user by email
   - Use comparePassword() method we created on model
   - If match, generate and return token

4. GET ME:
   - Protected route (needs token)
   - Just returns current user's info
   - Used by frontend to check if still logged in

5. ERROR MESSAGES:
   - We say "Invalid email or password" not "Email not found"
   - This is for security - don't reveal if email exists
*/
