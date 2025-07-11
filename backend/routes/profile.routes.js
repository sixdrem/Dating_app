import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getMyProfile, updateMyProfile } from "../controllers/profile.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();
router.get("/me", authMiddleware, getMyProfile);
router.put("/update", authMiddleware, updateMyProfile);
router.post("/", authMiddleware, upload.single('avatar'), updateMyProfile);
export default router;