import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const Solicitud = sequelize.define(
  "Solicitud",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estudiante_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    estado: {
      type: DataTypes.ENUM("Pendiente", "En revisión", "Respondida", "Cerrada"),
      defaultValue: "Pendiente"
    },
    creado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    actualizado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "solicitudes",
    timestamps: false
  }
);

export default Solicitud;
