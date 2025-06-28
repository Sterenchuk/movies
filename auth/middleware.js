import { verifyAccessToken } from "./jwt.js";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token)
    return res.status(401).json({
      status: 0,
      error: {
        fields: {
          token: "REQUIRED",
        },
        code: "FORMAT_ERROR",
      },
    });

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({
      status: 0,
      error: {
        fields: {
          token: "REQUIRED",
        },
        code: "FORMAT_ERROR",
      },
    });
  }
}
