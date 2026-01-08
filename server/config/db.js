// server/config/db.js
// ═══════════════════════════════════════════════════════════════
// This file handles connecting to MongoDB

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise
    // We use async/await to wait for it
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit the process with failure code
    process.exit(1);
  }
};

module.exports = connectDB;

/*
EXPLANATION:
- mongoose.connect() connects to our MongoDB database
- process.env.MONGODB_URI gets the connection string from .env file
- If connection fails, we log the error and stop the server
- We export the function so we can use it in index.js
*/
