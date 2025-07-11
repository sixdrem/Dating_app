// backend/routes/user.routes.js
import express from 'express';
import { likeUser } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js'; // Add this import at the top

const router = express.Router();

// GET / - list users for browsing, excluding current user, with pagination and profile data
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const users = await User.find({ _id: { $ne: req.user.id } })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ _id: { $ne: req.user.id } });

    // Fetch profiles for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ userId: user._id });
        return {
          _id: user._id,
          email: user.email,
          name: profile?.name || '',
          about: profile?.about || '',
          interests: profile?.interests || [],
          avatar: profile?.avatar || '',
        };
      })
    );

    res.json({
      users: usersWithProfiles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// POST /like/:id - like another user
router.post('/like/:id', authMiddleware, likeUser);

export default router;
