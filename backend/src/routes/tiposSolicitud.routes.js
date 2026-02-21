import { Router } from "express";
import TipoSolicitud from "../models/TipoSolicitud.js";

const router = Router();

// GET /tipos-solicitud — trae todos los tipos desde MySQL
router.get("/", async (req, res) => {
  try {
    const tipos = await TipoSolicitud.findAll({
      order: [["id", "ASC"]],
    });
    res.json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tipos de solicitud" });
  }
});

export default router;
