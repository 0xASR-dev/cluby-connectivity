export const DB_CONFIG = {
  username: import.meta.env.VITE_MONGODB_USERNAME,
  password: import.meta.env.VITE_MONGODB_PASSWORD,
  cluster: import.meta.env.VITE_MONGODB_CLUSTER,
  dbName: import.meta.env.VITE_MONGODB_DBNAME,
  uri: import.meta.env.VITE_MONGODB_URI || 
    `mongodb+srv://${import.meta.env.VITE_MONGODB_USERNAME}:${import.meta.env.VITE_MONGODB_PASSWORD}@${import.meta.env.VITE_MONGODB_CLUSTER}/${import.meta.env.VITE_MONGODB_DBNAME}?retryWrites=true&w=majority`
};

export const JWT_SECRET = import.meta.env.VITE_JWT_SECRET; 