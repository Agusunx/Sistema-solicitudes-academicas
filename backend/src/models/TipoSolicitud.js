import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const TipoSolicitud = sequelize.define(
  "TipoSolicitud",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false }
  },
  { tableName: "tipossolicitud", timestamps: false }
);

export default TipoSolicitud;
