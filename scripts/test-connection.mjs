import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { promisify } from 'util';

const resolveSrv = promisify(dns.resolveSrv);

dotenv.config();

const uri = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI;

console.log('🔍 MongoDB Connection Diagnostics\n');
console.log('================================\n');

// Extract cluster from URI
const clusterMatch = uri.match(/@([^/]+)/);
const cluster = clusterMatch ? clusterMatch[1] : null;

if (!cluster) {
  console.error('❌ Could not extract cluster from URI');
  process.exit(1);
}

console.log('1. Configuration Check:');
console.log('   Cluster:', cluster);
console.log('   Database:', uri.match(/\/([^?]+)/)?.[1] || 'unknown');
console.log('');

console.log('2. DNS Resolution Test:');
try {
  const srvRecord = `_mongodb._tcp.${cluster}`;
  console.log(`   Resolving: ${srvRecord}`);
  
  const records = await resolveSrv(srvRecord);
  console.log('   ✅ DNS resolution successful');
  console.log(`   Found ${records.length} MongoDB server(s)`);
  records.forEach((record, i) => {
    console.log(`   Server ${i + 1}: ${record.name}:${record.port}`);
  });
} catch (error) {
  console.log('   ❌ DNS resolution failed:', error.message);
  console.log('\n   Possible causes:');
  console.log('   - The cluster name is incorrect');
  console.log('   - The cluster was deleted from MongoDB Atlas');
  console.log('   - Your network/firewall is blocking DNS queries');
  console.log('   - You are offline or have network connectivity issues');
  console.log('\n   Please verify:');
  console.log('   1. Log into MongoDB Atlas (https://cloud.mongodb.com)');
  console.log('   2. Check if your cluster exists and is running');
  console.log('   3. Get the correct connection string from Atlas');
  process.exit(1);
}

console.log('\n3. MongoDB Connection Test:');
try {
  console.log('   Connecting...');
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  
  console.log('   ✅ Connected successfully!');
  console.log('   Database:', mongoose.connection.name);
  console.log('   Host:', mongoose.connection.host);
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`\n4. Collections (${collections.length}):`);
  if (collections.length === 0) {
    console.log('   No collections found');
  } else {
    collections.forEach(col => console.log(`   - ${col.name}`));
  }
  
  // Try to count users
  console.log('\n5. User Check:');
  try {
    const usersCollection = mongoose.connection.db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`   ✅ Found ${userCount} user(s) in database`);
    
    if (userCount > 0) {
      const users = await usersCollection.find({}, { projection: { email: 1, role: 1, _id: 0 } }).toArray();
      console.log('\n   User credentials:');
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.role || 'no role'})`);
      });
    }
  } catch (error) {
    console.log('   ⚠️  Could not query users:', error.message);
  }
  
} catch (error) {
  console.log('   ❌ Connection failed:', error.message);
  
  if (error.message.includes('Authentication failed')) {
    console.log('\n   The username or password is incorrect.');
    console.log('   Please check your MONGODB_URI in .env file');
  } else if (error.message.includes('IP')) {
    console.log('\n   Your IP address may not be whitelisted.');
    console.log('   Add your IP in MongoDB Atlas: Network Access → Add IP Address');
  }
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
}
