import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const Usuario = sequelize.define(
  "Usuario",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.ENUM("Estudiante","Administrador"), allowNull: false },
    creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  { tableName: "usuarios", timestamps: false }
);

export default Usuario;
