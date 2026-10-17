import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI;

if (!uri) {
  console.error('❌ No MongoDB URI found in environment variables');
  process.exit(1);
}

console.log('Using MongoDB URI from .env file');
console.log('Cluster:', uri.match(/@([^/]+)/)?.[1] || 'unknown');

async function checkMongoConnection() {
  console.log('🔄 Attempting to connect to MongoDB...\n');
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    const state = mongoose.connection.readyState;
    const stateMap = {
      0: '💔 Disconnected',
      1: '💚 Connected',
      2: '🔄 Connecting',
      3: '🔌 Disconnecting'
    };
    
    console.log('Connection Status:');
    console.log('----------------');
    console.log(`State: ${stateMap[state] || 'Unknown'}`);
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.name}`);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections:');
    console.log('------------');
    if (collections.length === 0) {
      console.log('No collections found in database');
    } else {
      collections.forEach(collection => console.log(`- ${collection.name}`));
    }
    
  } catch (error) {
    console.error('\n❌ Connection Error:');
    console.error('----------------');
    console.error(error.message);
    
    if (error.code === 'ETIMEDOUT') {
      console.error('\nPossible causes:');
      console.error('- Network connectivity issues');
      console.error('- MongoDB Atlas is down');
      console.error('- IP address not whitelisted in MongoDB Atlas');
    }
    
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('\n🔌 Connection closed');
    }
  }
}

checkMongoConnection(); 