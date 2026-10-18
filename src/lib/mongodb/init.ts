const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cluby';

async function initMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = { initMongoDB };

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Only import models on the server side
if (!isBrowser) {
  try {
    // Models - these should only be loaded server-side
    require('./models/User');
    require('./models/Profile');
    require('./models/Club');
    require('./models/Event');
    require('./models/Post');
    require('./models/Application');
    require('./models/ClubMembership');
    require('./models/Recruitment');
  } catch (error) {
    console.error('Error loading MongoDB models:', error);
  }
}

// Cache to prevent multiple initialization attempts
let initialized = false;

/**
 * Check if MongoDB is currently connected
 * Returns true if connected, false otherwise
 */
export function isMongoDBConnected() {
  if (isBrowser) {
    return false;
  }
  
  // 1 = connected, 0 = disconnected
  return mongoose.connection.readyState === 1;
}

/**
 * Safely close the MongoDB connection when the application is shutting down
 */
export async function closeMongoDB() {
  if (isBrowser) {
    return;
  }
  
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

// Register cleanup handlers for graceful shutdown
if (typeof globalThis !== 'undefined' && 'addEventListener' in globalThis) {
  globalThis.addEventListener('beforeunload', async () => {
    await closeMongoDB();
  });
}
