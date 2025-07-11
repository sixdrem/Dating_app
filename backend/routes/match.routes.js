import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getMatches } from '../controllers/user.controller.js';
const router = express.Router();
router.get("/", authMiddleware, getMatches);
export default router;