import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { INTEGER } from "sequelize/lib/data-types";

export const Movie = sequelize.define("Movie", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  format: {
    type: DataTypes.ENUM("VHS", "DVD", "Blu-ray"),
    allowNull: false,
  },
});
