import { usersService } from "../users/users-service.js";
import { HttpError } from "../classes/http-error.js";
import bcrypt from "bcrypt";
import { signAccessToken } from "./jwt.js";

class AuthService {
  async login(email, password) {
    const user = await usersService.getByEmail(email);
    if (!user) {
      throw new HttpError("User not found", 404, "USER_NOT_FOUND");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpError("Invalid password", 401, "INVALID_PASSWORD");
    }

    const token = signAccessToken({ user });
    return { user, token };
  }
}

export const authService = new AuthService();
