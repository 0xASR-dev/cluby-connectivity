import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load existing env
dotenv.config();

const MONGODB_URI = 'mongodb+srv://avneesh-singh:15q3RIL4Qwq3LKnf@cluby-cluster.a6odmyp.mongodb.net/cluby?retryWrites=true&w=majority';

async function updateEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    
    // Read existing .env content
    let envContent = '';
    try {
      envContent = fs.readFileSync(envPath, 'utf-8');
    } catch (error) {
      // If .env doesn't exist, create with default content
      envContent = `PORT=3000
JWT_SECRET=your-super-secret-jwt-key
VITE_API_URL=http://localhost:3000
VITE_APP_URL=http://localhost:5173`;
    }

    // Update or add MONGODB_URI
    if (envContent.includes('MONGODB_URI=')) {
      envContent = envContent.replace(
        /MONGODB_URI=.*/,
        `MONGODB_URI=${MONGODB_URI}`
      );
    } else {
      envContent = `MONGODB_URI=${MONGODB_URI}\n${envContent}`;
    }

    // Write back to .env
    fs.writeFileSync(envPath, envContent, 'utf-8');
    console.log('Successfully updated MongoDB URI in .env file');

  } catch (error) {
    console.error('Error updating .env file:', error);
    process.exit(1);
  }
}

updateEnv(); 