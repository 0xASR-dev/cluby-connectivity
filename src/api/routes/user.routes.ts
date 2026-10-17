import express from 'express';
import { UserService } from '@/lib/services/user.service';
import { AuthService } from '@/lib/auth/auth.service';
import { authenticateToken, protect, restrictTo } from '@/middleware/auth.middleware.js';
import { validateRequest } from '@/middleware/validation.middleware';
import { z } from 'zod';
import { User } from '../../lib/mongodb/models/User.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// Validation schemas
const updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['student', 'clubRepresentative', 'admin']).optional(),
  club_id: z.string().optional(),
  isActive: z.boolean().optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});

const searchUsersSchema = z.object({
  query: z.string(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional()
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching user profile'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error updating user profile'
    });
  }
});

// Admin only routes
router.use(restrictTo('admin'));

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching users'
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    // Allow users to view their own profile or admin to view any profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await UserService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.patch('/:id', async (req, res) => {
  try {
    // Allow users to update their own profile or admin to update any profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await UserService.updateUserProfile(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.post('/:id/change-password', async (req, res) => {
  try {
    // Users can only change their own password
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;
    await UserService.changePassword(req.params.id, currentPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (error.message === 'Current password is incorrect') {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deactivate user (admin only)
router.post('/:id/deactivate', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Activate user (admin only)
router.post('/:id/activate', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search users (admin only)
router.get('/search', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { query, page = 1, limit = 10 } = req.query;
    const result = await UserService.searchUsers(
      query as string,
      Number(page),
      Number(limit)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users by role (admin only)
router.get('/role/:role', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { page = 1, limit = 10 } = req.query;
    const result = await UserService.getUsersByRole(
      req.params.role,
      Number(page),
      Number(limit)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error deleting user'
    });
  }
});

export default router; 