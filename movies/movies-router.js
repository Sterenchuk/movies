import express from "express";
import { moviesController } from "./movies-controller.js";
import { authenticateToken } from "../auth/middleware.js";
import { upload } from "../files-helper/upload.js";
import { HttpError } from "../classes/http-error.js";
export const moviesRouter = express.Router();

// POST /api/v1/movies
moviesRouter.post("/movies", authenticateToken, (req, res) =>
  moviesController.create(req, res)
);

moviesRouter.put("/movies/:id", authenticateToken, (req, res) =>
  moviesController.update(req, res)
);
moviesRouter.get("/movies", authenticateToken, (req, res) =>
  moviesController.getAll(req, res)
);
moviesRouter.get("/movies/:id", authenticateToken, (req, res) =>
  moviesController.getById(req, res)
);

moviesRouter.delete("/movies/:id", authenticateToken, (req, res) =>
  moviesController.delete(req, res)
);

moviesRouter.post(
  "/import",
  authenticateToken,
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err instanceof HttpError) {
        return res.status(err.status || 400).json({
          status: 0,
          error: {
            message: err.message,
            code: err.code || "UPLOAD_ERROR",
            fields: err.fields,
          },
        });
      } else if (err) {
        return res.status(400).json({
          status: 0,
          error: { message: err.message, code: "UPLOAD_ERROR" },
        });
      }
      next();
    });
  },
  (req, res) => moviesController.import(req, res)
);
