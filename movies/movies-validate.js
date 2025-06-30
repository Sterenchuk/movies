import { HttpError } from "../classes/http-error.js";
import { regex } from "../classes/regex.js";

const formatOptions = ["VHS", "DVD", "Blu-ray"];
const sortOptions = ["id", "title", "year", "format"];
const orderOptions = ["ASC", "DESC"];

class MovieValidator {
  validateMovieInput(data, mode = "create") {
    if (!data) {
      throw new HttpError("Invalid input data", 400, "DATA_INVALID", {
        data: "NOT_EXIST",
      });
    }

    const { id, title, year, format, actors } = data;

    if (["id", "update"].includes(mode)) {
      const numericId = Number(id);
      if (
        !Number.isInteger(numericId) ||
        numericId <= 0 ||
        numericId >= 9223372036854775807
      ) {
        throw new HttpError("Valid movie ID is required", 400, "ID_INVALID", {
          id: "NOT_VALID",
        });
      }
      if (mode === "id") return;
    }

    if (
      !title ||
      typeof year === "undefined" ||
      !format ||
      (mode === "create" && (!Array.isArray(actors) || actors.length === 0))
    ) {
      throw new HttpError(
        "Missing required movie fields",
        400,
        "FIELDS_MISSING",
        { title: "NOT_EXIST" }
      );
    }

    if (!regex.title.test(title) || title.trim() === "") {
      throw new HttpError("Invalid title format", 400, "TITLE_INVALID", {
        title: "NOT_VALID",
      });
    }

    if (
      typeof year !== "number" ||
      year < 1888 ||
      year > new Date().getFullYear()
    ) {
      throw new HttpError("Invalid year", 400, "YEAR_INVALID", {
        year: "NOT_VALID",
      });
    }

    if (!formatOptions.includes(format)) {
      throw new HttpError("Wrong format", 400, "FORMAT_INVALID", {
        format: "NOT_VALID",
      });
    }

    if (actors && (!Array.isArray(actors) || actors.length === 0)) {
      throw new HttpError(
        "Actors list cannot be empty",
        400,
        "ACTORS_IS_EMPTY"
      );
    }

    if (Array.isArray(actors)) {
      for (const actor of actors) {
        if (!regex.actorName.test(actor)) {
          throw new HttpError(
            `Invalid actor name: ${actor}`,
            400,
            "ACTOR_NAME_INVALID"
          );
        }
      }
    }
  }

  validateGetAllQuery(query = {}) {
    const { actor, title, sort, order, limit, offset } = query;

    const fields = {};

    if (title !== undefined && typeof title !== "string") {
      fields.title = "NOT_VALID";
    }

    if (actor !== undefined && typeof actor !== "string") {
      fields.actor = "NOT_VALID";
    }

    const sortOptions = ["id", "title", "year", "format"];
    if (sort !== undefined && !sortOptions.includes(sort)) {
      fields.sort = "NOT_VALID";
    }

    const orderOptions = ["ASC", "DESC"];
    if (order !== undefined && !orderOptions.includes(order.toUpperCase?.())) {
      fields.order = "NOT_VALID";
    }

    if (limit !== undefined) {
      const limitNum = Number(limit);
      if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
        fields.limit = "NOT_VALID";
      }
    }

    if (offset !== undefined) {
      const offsetNum = Number(offset);
      if (!Number.isInteger(offsetNum) || offsetNum < 0) {
        fields.offset = "NOT_VALID";
      }
    }

    if (Object.keys(fields).length > 0) {
      throw new HttpError("Invalid query parameters", 400, "FORMAT_ERROR", {
        fields,
      });
    }
  }
}

export const movieValidator = new MovieValidator();
