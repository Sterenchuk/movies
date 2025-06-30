import { Movie } from "../models/movie.js";
import { Actor } from "../models/actor.js";
import { HttpError } from "../classes/http-error.js";
import fs from "fs/promises";
import { Op, fn, col } from "sequelize";

class MoviesService {
  async createMovie(data) {
    const { title, year, format, actors } = data;

    const isMoveieValid = await Movie.findOne({
      where: { title },
    });

    if (isMoveieValid) {
      throw new HttpError(
        "Movie with this title already exists",
        400,
        "MOVIE_EXISTS",
        { title: "NOT_UNIQUE" },
        "MOVIE_EXISTS"
      );
    }

    const actorInstances = [];
    for (const name of actors) {
      const [actor] = await Actor.findOrCreate({ where: { name } });
      actorInstances.push(actor);
    }

    const movie = await Movie.create({
      title,
      year,
      format,
    });

    await movie.addActors(actorInstances);

    return movie;
  }

  async getAll(query = {}) {
    const {
      actor,
      title,
      sort = "id",
      order = "ASC",
      limit = 20,
      offset = 0,
    } = query;

    const where = {};
    const actorWhere = {};

    if (title) {
      where.title = { [Op.like]: `%${title}%` };
    }

    if (actor) {
      actorWhere.name = { [Op.like]: `%${actor}%` };
    }

    const movies = await Movie.findAll({
      where,
      include: {
        model: Actor,
        as: "Actors",
        where: Object.keys(actorWhere).length ? actorWhere : undefined,
        attributes: ["name"],
      },
      order: [[fn("LOWER", col("title")), order]], // to retrun based on title case-insensitive
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    if (!movies || movies.length === 0) {
      throw new HttpError("No movies found", 404, "NOT_FOUND", {
        query: "NO_MOVIES",
      });
    }

    return movies;
  }

  async getById(id) {
    const movie = await Movie.findByPk(id, {
      include: {
        model: Actor,
        as: "Actors",
        attributes: ["name"],
      },
    });
    if (!movie) {
      throw new HttpError("Movie not found", 404, "NOT_FOUND", {
        id: "NOT_EXIST",
      });
    }
    return movie;
  }

  async update(id, data) {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw new HttpError("Movie not found", 404, "NOT_FOUND", {
        id: id,
      });
    }

    const { title, year, format, actors } = data;

    if (title) movie.title = title;
    if (year) movie.creationDate = new Date(`${year}`);
    if (format) movie.format = format;

    await movie.save();

    if (actors) {
      const actorInstances = [];
      for (const name of actors) {
        const [actor] = await Actor.findOrCreate({ where: { name } });
        actorInstances.push(actor);
      }
      await movie.setActors(actorInstances);
    }

    return movie;
  }

  async import(content, filePath) {
    const blocks = content.split(/\n\s*\n/);
    const importedMovies = [];

    try {
      for (const block of blocks) {
        const lines = block.split("\n").map((line) => line.trim());
        if (lines.length < 4) {
          throw new HttpError("Invalid block format", 400, "BAD_REQUEST", {
            block: "INVALID_BLOCK",
          });
        }

        const title = lines[0]?.replace(/^Title:\s*/, "");
        const year = parseInt(lines[1]?.replace(/^Release Year:\s*/, ""), 10);
        const format = lines[2]?.replace(/^Format:\s*/, "");
        const stars = lines[3]
          ?.replace(/^Stars:\s*/, "")
          .split(",")
          .map((a) => a.trim());

        if (!title || !year || !format || !stars || stars.length === 0) {
          throw new HttpError("Missing movie fields", 400, "BAD_REQUEST");
        }

        const movie = await Movie.create({ title, year, format });

        const actorInstances = [];

        for (const name of stars) {
          const [actor] = await Actor.findOrCreate({ where: { name } });
          actorInstances.push(actor);
        }

        await movie.addActors(actorInstances);
        importedMovies.push(movie);
      }

      return { status: 1, data: importedMovies };
    } finally {
      if (filePath) {
        // Clean up the file after processing
        try {
          await fs.unlink(filePath);
        } catch (cleanupErr) {
          console.error(` Failed to delete file: ${filePath}`, cleanupErr);
        }
      }
    }
  }

  async delete(id) {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw new HttpError("Movie not found", 404, "NOT_FOUND", {
        id: id,
      });
    }
    await movie.destroy();
    return { status: 1 };
  }
}

export const moviesService = new MoviesService();
