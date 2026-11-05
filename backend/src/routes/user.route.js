
import { Router } from "express";
import { registerUser,loginUser, logoutUser, refreshToken } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register",registerUser);
router.post("/login",authMiddleware,loginUser);
router.post("/logout",authMiddleware,logoutUser);
router.post("/refresh", refreshToken);
export default router;

// to test on postman : http://localhost:4000/api/auth/register