import express from 'express';
import { loginRoute, registerRoute, logoutRoute } from '../api/auth/index.js';

const router = express.Router();

// Auth routes
router.post('/login', loginRoute);
router.post('/register', registerRoute);
router.post('/logout', logoutRoute);

export default router; 