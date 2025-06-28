// core
import express from "express";

// controllers
import { authController } from "./auth-controller.js";

export const authRouter = express.Router();

// POST /api/v1/auth/session
authRouter.post("/session", authController.login);
