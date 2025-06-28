import { userValidator } from "./users-validate.js";
import { usersService } from "./users-service.js";
import { signAccessToken } from "../auth/jwt.js";

class UserController {
  constructor(usersService) {
    this.userService = usersService;
  }

  async create(req, res) {
    const user = req.body;
    try {
      userValidator.validateUserInput(user, "create");

      const newUser = await this.userService.create(
        user.name,
        user.email,
        user.password,
        user.confirmPassword
      );

      const token = signAccessToken(newUser);
      res.status(201).json({ token, status: 1 });
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          message: err.message,
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || undefined,
        },
      });
    }
  }

  async getAll(req, res) {
    try {
      const conditions = req.query || {};
      const users = await this.userService.getAll(conditions);
      res.json(users);
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          message: err.message,
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || undefined,
        },
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      userValidator.validateUserInput({ id }, "id");

      const user = await this.userService.getById(id, {
        excludePassword: true,
      });

      res.json(user);
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          message: err.message,
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || undefined,
        },
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const user = req.body;

      userValidator.validateUserInput({ id, ...user }, "update");

      const result = await this.userService.update(id, user);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          message: err.message,
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || undefined,
        },
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      userValidator.validateUserInput({ id }, "delete");

      const result = await this.userService.delete(id);

      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({
        status: 0,
        error: {
          message: err.message,
          code: err.code || "INTERNAL_ERROR",
          fields: err.fields || undefined,
        },
      });
    }
  }
}

export const userController = new UserController(usersService);
