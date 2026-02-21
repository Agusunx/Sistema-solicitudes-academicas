import { Router } from "express";
import { Solicitud, Usuario, TipoSolicitud } from "../models/index.js";

const router = Router();

// GET /solicitudes — devuelve todas con nombre del estudiante y tipo
router.get("/", async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({
      include: [
        { model: Usuario,       as: "Usuario",       attributes: ["nombre"] },
        { model: TipoSolicitud, as: "TipoSolicitud", attributes: ["nombre"] }
      ],
      order: [["creado_en", "DESC"]]
    });
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ message: "Error al obtener solicitudes" });
  }
});

// POST /solicitudes — crea una nueva solicitud
router.post("/", async (req, res) => {
  const { usuario_id, tipo_id, titulo, descripcion } = req.body;

  if (!usuario_id || !tipo_id || !titulo || !descripcion) {
    return res.status(400).json({ message: "Faltan datos para crear la solicitud" });
  }

  try {
    const nueva = await Solicitud.create({
      estudiante_id: usuario_id,
      tipo_id,
      titulo,
      descripcion,
      estado: "Pendiente",
      creado_en: new Date(),
      actualizado_en: new Date()
    });
    res.json({ message: "Solicitud creada", id: nueva.id });
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res.status(500).json({ message: "Error al crear solicitud" });
  }
});

// PATCH /solicitudes/:id — actualiza el estado
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ["Pendiente", "En revisión", "Respondida", "Cerrada"];
  if (!estado || !estadosValidos.includes(estado)) {
    return res.status(400).json({ message: "Estado no válido" });
  }

  try {
    await Solicitud.update(
      { estado, actualizado_en: new Date() },
      { where: { id } }
    );
    res.json({ message: "Estado actualizado" });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
});

export default router;
