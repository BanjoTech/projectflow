// server/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  try {
    // Check if Authorization header exists and starts with 'Bearer'
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, no token',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token and attach to request
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        message: 'Not authorized, user not found',
      });
    }

    // Call next middleware
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      message: 'Not authorized, token failed',
    });
  }
};

module.exports = protect;
