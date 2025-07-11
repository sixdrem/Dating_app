import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { likeUser } from '../controllers/user.controller.js';

const router = express.Router();

// POST /:id - like another user
router.post('/:id', authMiddleware, likeUser);

export default router; 