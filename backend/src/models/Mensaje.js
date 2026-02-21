import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const Mensaje = sequelize.define(
  "Mensaje",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    creado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Mensajes",
    timestamps: false,
  }
);

export default Mensaje;
