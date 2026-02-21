// dotenv DEBE ser lo primero antes de cualquier import que use variables de entorno
import "dotenv/config";

import { sequelize, testConnection } from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`🚀 Backend activo en http://localhost:${PORT}`);
      console.log(`🤖 GROQ_API_KEY cargada: ${process.env.GROQ_API_KEY ? "✅ SÍ" : "❌ NO — verificá tu .env"}`);
    });

  } catch (error) {
    console.error("❌ Error iniciando servidor:", error);
  }
};

startServer();
