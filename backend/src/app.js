import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import tiposSolicitudRoutes from "./routes/tiposSolicitud.routes.js";
import mensajesRoutes from "./routes/mensajes.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "https://tu-app.vercel.app"] }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend del Sistema de Solicitudes Académicas funcionando ✅");
});

app.use("/auth", authRouter);
app.use("/solicitudes", solicitudesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/tipos-solicitud", tiposSolicitudRoutes);
app.use("/mensajes", mensajesRoutes);
app.use("/chat", chatRoutes);

export default app;
