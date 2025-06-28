import { HttpError } from "../classes/http-error.js";
import { regex } from "../classes/regex.js";

class UserValidator {
  validateUserInput(data, mode = "create") {
    if (!data || typeof data !== "object") {
      throw new HttpError("Invalid input data", 400, "DATA_INVALID", {
        data: "NOT_EXIST",
      });
    }

    const { id, name, email, password, confirmPassword } = data;

    if (["id", "update", "delete"].includes(mode)) {
      const numericId = Number(id);
      if (
        !Number.isInteger(numericId) ||
        numericId <= 0 ||
        numericId >= 9223372036854775807
      ) {
        throw new HttpError("Valid user ID is required", 400, "ID_INVALID", {
          id: "NOT_VALID",
        });
      }

      if (mode === "id" || mode === "delete") return;
    }

    if (mode === "create") {
      if (!name || !email || !password || !confirmPassword) {
        throw new HttpError("Missing required fields", 400, "FIELDS_MISSING", {
          name: !name ? "NOT_EXIST" : undefined,
          email: !email ? "NOT_EXIST" : undefined,
          password: !password ? "NOT_EXIST" : undefined,
          confirmPassword: !confirmPassword ? "NOT_EXIST" : undefined,
        });
      }
    }

    if (name !== undefined && !regex.name.test(name)) {
      throw new HttpError("Invalid name format", 400, "NAME_INVALID", {
        name: "NOT_VALID",
      });
    }

    if (email !== undefined && !regex.email.test(email)) {
      throw new HttpError("Invalid email format", 400, "EMAIL_INVALID", {
        email: "NOT_VALID",
      });
    }

    if (password !== undefined) {
      if (!regex.password.test(password)) {
        throw new HttpError(
          "Invalid password format",
          400,
          "PASSWORD_INVALID",
          { password: "NOT_VALID" }
        );
      }

      if (mode === "create" && password !== confirmPassword) {
        throw new HttpError("Passwords do not match", 400, "PASSWORD_MISMATCH");
      }
    }
  }
}

export const userValidator = new UserValidator();
