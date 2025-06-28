import express from "express";
import { userController } from "./users-controller.js";
import { authenticateToken } from "../auth/middleware.js";

export const usersRoute = express.Router();

usersRoute.post("/users", (req, res) => userController.create(req, res));
usersRoute.put("/users/:id", authenticateToken, (req, res) =>
  userController.update(req, res)
);
usersRoute.get("/users", (req, res) => userController.getAll(req, res));
usersRoute.get("/users/:id", authenticateToken, (req, res) =>
  userController.getById(req, res)
);
usersRoute.delete("/users/:id", authenticateToken, (req, res) =>
  userController.delete(req, res)
);
