import { Router } from "express";
import Usuario from "../models/Usuario.js";

const router = Router();

// GET /usuarios — lista todos los usuarios (solo para admin)
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nombre", "email", "rol", "creado_en"],
      order: [["creado_en", "DESC"]],
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// GET /usuarios/:id — obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: ["id", "nombre", "email", "rol", "creado_en"],
    });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
});

export default router;
