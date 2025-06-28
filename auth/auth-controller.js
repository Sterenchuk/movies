import { authService } from "./auth-service.js";

export const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 0,
          error: {
            fields: {
              email: "AUTHENTICATION_FAILED",
              password: "AUTHENTICATION_FAILED",
            },
            code: "CREDENTIALS_MISSING",
          },
        });
      }

      const { user, token } = await authService.login(email, password);
      res.json({
        status: 1,
        token,
      });
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
  },
};
