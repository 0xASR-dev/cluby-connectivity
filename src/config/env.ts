export const env = {
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  MONGODB_URI: import.meta.env.MONGODB_URI || 'mongodb://localhost:27017/cluby',
  JWT_SECRET: import.meta.env.JWT_SECRET || 'your_jwt_secret_here'
} as const;

export type Env = typeof env; 