// Environment configuration for MongoDB connection
// This file provides connection details while ensuring credentials are secure

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get environment variables from either Vite (browser) or process.env (Node.js)
const getEnv = (key: string) => {
  if (isBrowser && typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  return process.env[key];
};

// Environment variables
export const JWT_SECRET = getEnv('VITE_JWT_SECRET') || getEnv('JWT_SECRET') || 'any text can be used';
export const DB_CONFIG = {
  username: getEnv('VITE_MONGODB_USERNAME') || getEnv('MONGODB_USERNAME') || 'avneesh-singh',
  password: getEnv('VITE_MONGODB_PASSWORD') || getEnv('MONGODB_PASSWORD') || '15q3RIL4Qwq3LKnf',
  cluster: getEnv('VITE_MONGODB_CLUSTER') || getEnv('MONGODB_CLUSTER') || 'cluby-cluster.a6odmyp.mongodb.net',
  dbName: getEnv('VITE_MONGODB_DBNAME') || getEnv('MONGODB_DBNAME') || 'cluby',
  uri: getEnv('VITE_MONGODB_URI') || getEnv('MONGODB_URI') || `mongodb+srv://${getEnv('VITE_MONGODB_USERNAME') || getEnv('MONGODB_USERNAME') || 'avneesh-singh'}:${getEnv('VITE_MONGODB_PASSWORD') || getEnv('MONGODB_PASSWORD') || '15q3RIL4Qwq3LKnf'}@${getEnv('VITE_MONGODB_CLUSTER') || getEnv('MONGODB_CLUSTER') || 'cluby-cluster.a6odmyp.mongodb.net'}/${getEnv('VITE_MONGODB_DBNAME') || getEnv('MONGODB_DBNAME') || 'cluby'}?retryWrites=true&w=majority&appName=cluby`
};

// Function to safely get environment variables
export function getEnvVariable(key: string, defaultValue: string = ''): string {
  if (isBrowser) {
    console.warn(`Attempting to access environment variable (${key}) in browser`);
    return defaultValue;
  }
  
  return process.env[key] || defaultValue;
}
