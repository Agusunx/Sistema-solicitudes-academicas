import { Router } from "express";
import { Mensaje, Usuario, Solicitud } from "../models/index.js";

const router = Router();

// 🔹 Obtener mensajes de una solicitud
router.get("/:solicitudId", async (req, res) => {
  try {
    const { solicitudId } = req.params;

    const mensajes = await Mensaje.findAll({
      where: { solicitud_id: solicitudId },
      include: [{ model: Usuario }]
    });

    res.json(mensajes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
});

// 🔹 Crear nuevo mensaje
router.post("/", async (req, res) => {
  try {
    const { solicitud_id, usuario_id, contenido } = req.body;

    if (!solicitud_id || !usuario_id || !contenido) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const nuevoMensaje = await Mensaje.create({
      solicitud_id,
      usuario_id,
      contenido
    });

    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear mensaje" });
  }
});

export default router;
