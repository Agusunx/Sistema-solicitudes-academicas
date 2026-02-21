import { Router } from "express";
import Usuario from "../models/Usuario.js"; // tu modelo Sequelize

const router = Router();

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Faltan datos" });

    const usuario = await Usuario.findOne({ where: { email, password } });

    if (!usuario)
      return res.status(401).json({ message: "Usuario o clave incorrectos" });

    // Retornamos datos mínimos
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
      email: usuario.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
});

export default router;
