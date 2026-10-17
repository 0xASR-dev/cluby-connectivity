import { getSession } from 'next-auth/react';
import User from '../lib/mongodb/models/User';

export const requireAuth = (handler) => {
  return async (req, res) => {
    const session = await getSession({ req });
    
    if (!session) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Attach user to request
    req.user = session.user;
    return handler(req, res);
  };
};

export const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const session = await getSession({ req });
      
      if (!session) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await User.findOne({ email: session.user.email });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.hasRole(roles)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Attach full user object to request
      req.user = user;
      return next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export const isAuthenticated = async (req) => {
  const session = await getSession({ req });
  return !!session;
};

export const getCurrentUser = async (req) => {
  const session = await getSession({ req });
  if (!session) return null;
  
  return await User.findOne({ email: session.user.email });
}; 