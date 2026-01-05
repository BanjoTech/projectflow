// server/models/User.js
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// MIDDLEWARE: Hash password before saving
// FIX: With async functions, we don't use next() - just return
userSchema.pre('save', async function () {
  // Only hash if password was modified (or is new)
  if (!this.isModified('password')) {
    return; // Just return, no next()
  }

  // Generate salt
  const salt = await bcrypt.genSalt(10);

  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);

  // No next() needed - async function returns a Promise
  // Mongoose waits for the Promise to resolve
});

// METHOD: Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

/*
EXPLANATION OF THE FIX:

OLD WAY (with next):
  userSchema.pre('save', async function(next) {
    // do stuff
    next();  // This can cause "next is not a function" in newer Mongoose
  });

NEW WAY (without next):
  userSchema.pre('save', async function() {
    // do stuff
    return;  // Just return - Mongoose handles the rest
  });

When using async/await in Mongoose middleware, the function returns
a Promise. Mongoose automatically waits for that Promise to resolve
before continuing. We don't need next() at all.
*/
