import { Router } from "express";

const router = Router();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `Sos un asistente virtual del Sistema de Gestión de Solicitudes Académicas de la universidad.

Tu único rol es orientar a los estudiantes para que identifiquen qué tipo de solicitud deben realizar según su situación.

Los tipos de solicitud disponibles son:
1. Cambio de comisión — Para cambiar de grupo/horario en una materia
2. Excepción a correlatividades — Para cursar una materia sin tener aprobadas las correlativas
3. Reincorporación a la carrera — Para retomar los estudios después de haber sido dado de baja
4. Prórroga de regularidad — Para extender el plazo de regularidad de una materia
5. Cambio de carrera o turno — Para cambiar de carrera o de turno
6. Constancia institucional especial — Para solicitar documentación especial
7. Nota institucional firmada — Para obtener una nota oficial firmada por la institución
8. Consulta por equivalencias — Para consultar sobre equivalencias de materias
9. Consulta académica — Para consultas generales sobre la carrera o trámites
10. Seguimiento de solicitud — Para hacer seguimiento de una solicitud ya presentada

Reglas:
- Solo respondés sobre qué tipo de solicitud hacer
- No tomás decisiones, solo orientás y sugerís
- Si te preguntan otra cosa, decís amablemente que solo podés ayudar con solicitudes académicas
- Respondés siempre en español, de forma clara y breve
- Si no encaja exactamente, sugerís la opción más cercana`;

router.post("/", async (req, res) => {
  const { mensaje, historial = [] } = req.body;

  if (!mensaje || mensaje.trim() === "") {
    return res.status(400).json({ error: "El mensaje no puede estar vacío" });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("❌ GROQ_API_KEY no está definida en el .env");
    return res.status(500).json({ error: "El asistente no está configurado. Falta la API key en el servidor." });
  }

  const mensajesParaAPI = [
    { role: "system", content: SYSTEM_PROMPT },
    ...historial.slice(-6),
    { role: "user", content: mensaje }
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: mensajesParaAPI,
        max_tokens: 400,
        temperature: 0.5
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error de Groq:", JSON.stringify(data));
      return res.status(500).json({ error: `Error de Groq: ${data.error?.message ?? "desconocido"}` });
    }

    const respuesta = data.choices?.[0]?.message?.content ?? "No pude generar una respuesta.";
    res.json({ respuesta });

  } catch (error) {
    console.error("❌ Error en /chat:", error.message);
    res.status(500).json({ error: "Error de conexión con el servicio de IA." });
  }
});

export default router;
