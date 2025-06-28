import { moviesService } from "./movies-service.js";
import { movieValidator } from "./movies-validate.js";
import fs from "fs/promises";

class MoviesController {
  constructor(moviesService) {
    this.moviesService = moviesService;
  }

  async create(req, res) {
    try {
      const movie = req.body;
      movieValidator.validateMovieInput(movie, "create");

      const createdMovie = await this.moviesService.createMovie(movie);

      if (!createdMovie) {
        return res.status(400).json({
          status: 0,
          error: {
            code: "CREATE_FAILED",
            fields: {
              movie: "CREATE_FAILED",
            },
          },
        });
      }

      res.status(201).json({ status: 1, data: createdMovie });
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || null,
          message: err.message,
        },
      });
    }
  }

  async getAll(req, res) {
    try {
      const conditions = req.query || {};
      movieValidator.validateGetAllQuery(conditions);
      const movies = await this.moviesService.getAll(conditions);
      res.json({ status: 1, data: movies });
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || null,
          message: err.message,
        },
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      movieValidator.validateMovieInput({ id }, "id");

      const movie = await this.moviesService.getById(id);
      res.json({ status: 1, data: movie });
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || null,
          message: err.message,
        },
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const movie = req.body;

      movieValidator.validateMovieInput({ id, ...movie }, "update");

      const updatedMovie = await this.moviesService.update(id, movie);
      res.json({ status: 1, data: updatedMovie });
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || null,
          message: err.message,
        },
      });
    }
  }

  async import(req, res) {
    if (!req.file) {
      return res.status(400).json({
        status: 0,
        error: {
          code: "FILE_MISSING",
          fields: {
            file: "REQUIRED",
          },
        },
      });
    }

    const filePath = req.file.path;

    try {
      const content = await fs.readFile(filePath, "utf-8");
      const result = await moviesService.import(content, filePath);
      res.status(201).json({ status: 1, data: result });
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || null,
          message: err.message,
        },
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      movieValidator.validateMovieInput({ id }, "id");

      const result = await this.moviesService.delete(id);
      res.status(200).json({ status: 1, data: result });
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || null,
          message: err.message,
        },
      });
    }
  }
}

export const moviesController = new MoviesController(moviesService);
