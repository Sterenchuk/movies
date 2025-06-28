import { User } from "../models/user.js";
import { HttpError } from "../classes/http-error.js";
import * as bcrypt from "bcrypt";

class UsersService {
  async create(name, email, password, confirmPassword) {
    try {
      if (password !== confirmPassword) {
        throw new HttpError(
          "Passwords do not match",
          400,
          "PASSWORD_MISMATCH",
          {}
        );
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new HttpError("This email is already in use", 400, "NOT_UNIQUE", {
          email: "NOT_UNIQUE",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        passwordHash,
        email,
      });

      if (!user) {
        throw new HttpError("Failed to create user", 500, "CREATE_FAILED", {});
      }

      return { status: 1, data: user };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("Error creating user:", error);
      throw new HttpError("Failed to create user", 500, "CREATE_FAILED", {});
    }
  }

  async getAll(conditions = {}) {
    try {
      const users = await User.findAll({
        where: conditions,
        attributes: { exclude: ["passwordHash"] }, // Exclude password hash from results
      });
      return { status: 1, data: users };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new HttpError("Failed to fetch users", 500, "FETCH_FAILED", {});
    }
  }

  async getById(id) {
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ["passwordHash"] },
      });
      if (!user) {
        throw new HttpError("User not found", 404, "NOT_FOUND", {
          id: "NOT_EXIST",
        });
      }
      return { status: 1, data: user };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("Error fetching user by ID:", error);
      throw new HttpError(
        "Failed to fetch user by ID",
        500,
        "FETCH_FAILED",
        {}
      );
    }
  }

  async getByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new HttpError("User not found", 404, "NOT_FOUND", {
          email: "NOT_EXIST",
        });
      }
      return user;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("Error fetching user by email:", error);
      throw new HttpError(
        "Failed to fetch user by email",
        500,
        "FETCH_FAILED",
        {}
      );
    }
  }

  async update(id, updates) {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new HttpError("User not found", 404, "NOT_FOUND", {
          id: "NOT_EXIST",
        });
      }

      if (updates.password) {
        updates.passwordHash = await bcrypt.hash(updates.password, 10);
        delete updates.password; // Remove plain password from updates
      }

      await user.update(updates);
      return { status: 1 };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("Error updating user:", error);
      throw new HttpError("Failed to update user", 500, "UPDATE_FAILED", {});
    }
  }

  async delete(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new HttpError("User not found", 404, "NOT_FOUND", {
          id: "NOT_EXIST",
        });
      }
      await user.destroy();

      return { status: 1 };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      console.error("Error deleting user:", error);
      throw new HttpError("Failed to delete user", 500, "DELETE_FAILED", {});
    }
  }
}

export const usersService = new UsersService();
