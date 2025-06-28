//core
import express from "express";
import cors from "cors";

//helpers
import { config } from "dotenv";

config();

//database
import { sequelize } from "./models/db.js";
import { User } from "./models/user.js";
import { Actor } from "./models/actor.js";
import { Movie } from "./models/movie.js";
// Define associations
Movie.belongsToMany(Actor, { through: "MovieActors" });
Actor.belongsToMany(Movie, { through: "MovieActors" });

//routes
import { authRouter } from "./auth/auth-route.js";
import { usersRoute } from "./users/users-route.js";
import { moviesRouter } from "./movies/movies-router.js";

// Initialize Express app
const app = express();
app.use(express.json());

// Register routes
app.use("/api/v1", usersRoute);
app.use("/api/v1/", authRouter);
app.use("/api/v1/", moviesRouter);

// Sync the database and create tables
await sequelize.sync({ force: true });

// allow CORS for frontend development
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Sync the database and start the server
const start = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced.");

    const PORT = process.env.APP_PORT || 8000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

start();
