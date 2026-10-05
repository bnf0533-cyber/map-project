import express from "express";
import { getMe, login, register } from "../controller/auth.controller.js";
import { validateUser } from "../middleware/validateUser.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", validateUser, register);

router.post("/login", validateUser, login);

router.get("/me", authMiddleware, getMe);
export default router;
