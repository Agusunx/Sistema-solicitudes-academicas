import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const Historial = sequelize.define(
  "Historial",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detalle: {
      type: DataTypes.TEXT,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Historial",
    timestamps: false,
  }
);

export default Historial;
