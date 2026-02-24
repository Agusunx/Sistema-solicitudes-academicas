import { useState, useRef, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const MENSAJE_INICIAL = {
  role: "assistant",
  content: "Hola, soy el asistente académico. Contame tu situación y te ayudo a identificar qué tipo de solicitud necesitás hacer."
};

export default function ChatAsistente() {
  const [abierto,    setAbierto]    = useState(false);
  const [minimizado, setMinimizado] = useState(false);
  const [mensaje,    setMensaje]    = useState("");
  const [historial,  setHistorial]  = useState([MENSAJE_INICIAL]);
  const [cargando,   setCargando]   = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (abierto && !minimizado)
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historial, abierto, minimizado]);

  useEffect(() => {
    if (abierto && !minimizado)
      setTimeout(() => inputRef.current?.focus(), 120);
  }, [abierto, minimizado]);

  const enviarMensaje = async () => {
    const texto = mensaje.trim();
    if (!texto || cargando) return;

    const nuevoHistorial = [...historial, { role: "user", content: texto }];
    setHistorial(nuevoHistorial);
    setMensaje("");
    setCargando(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje: texto,
          historial: nuevoHistorial.slice(1).map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      setHistorial(prev => [...prev, {
        role: "assistant",
        content: res.ok ? (data.respuesta ?? "Sin respuesta.") : `Error: ${data.error ?? "desconocido"}`
      }]);
    } catch {
      setHistorial(prev => [...prev, {
        role: "assistant",
        content: "No se pudo conectar con el asistente. Verificá que el servidor esté corriendo."
      }]);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const limpiarChat = () => setHistorial([MENSAJE_INICIAL]);

  return (
    <>
      <style>{`
        .chat-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background-color: #111827;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.22);
          transition: background-color 0.15s, transform 0.15s;
        }

        .chat-fab:hover {
          background-color: #1f2937;
          transform: translateY(-2px);
        }

        .chat-fab-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #4ade80;
          flex-shrink: 0;
        }

        .chat-window {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 356px;
          z-index: 1000;
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 12px 48px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08);
          border: 1px solid #e0e4e8;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          padding: 14px 16px;
          background-color: #111827;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chat-header-icono {
          width: 34px;
          height: 34px;
          background-color: rgba(255,255,255,0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.12);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.5px;
        }

        .chat-header-titulo {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          display: block;
        }

        .chat-header-estado {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 3px;
        }

        .chat-estado-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #4ade80;
          display: inline-block;
          flex-shrink: 0;
        }

        .chat-header-botones {
          display: flex;
          gap: 4px;
        }

        .chat-hbtn {
          width: 28px;
          height: 28px;
          background-color: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          color: rgba(255,255,255,0.65);
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          transition: background-color 0.15s;
        }

        .chat-hbtn:hover {
          background-color: rgba(255,255,255,0.15);
          color: #ffffff;
        }

        .chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 320px;
          background-color: #f9fafb;
        }

        .chat-body::-webkit-scrollbar { width: 3px; }
        .chat-body::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }

        .chat-msg {
          display: flex;
          flex-direction: column;
          max-width: 84%;
        }

        .chat-msg.user { align-self: flex-end; }
        .chat-msg.bot  { align-self: flex-start; }

        .chat-burbuja {
          padding: 10px 14px;
          font-size: 13.5px;
          line-height: 1.55;
          white-space: pre-wrap;
          font-family: 'Inter', sans-serif;
        }

        .chat-msg.user .chat-burbuja {
          background-color: #111827;
          color: #ffffff;
          border-radius: 14px 14px 4px 14px;
        }

        .chat-msg.bot .chat-burbuja {
          background-color: #ffffff;
          color: #374151;
          border-radius: 14px 14px 14px 4px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .chat-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px 14px 14px 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          width: fit-content;
        }

        .chat-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #9ca3af;
          animation: tipeo 1.3s infinite ease-in-out;
        }

        .chat-typing span:nth-child(2) { animation-delay: 0.18s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.36s; }

        @keyframes tipeo {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-5px); opacity: 1; }
        }

        .chat-input-area {
          padding: 12px;
          background-color: #ffffff;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 8px;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .chat-input {
          flex: 1;
          padding: 9px 12px;
          border-radius: 8px;
          border: 1.5px solid #e0e4e8;
          font-size: 13.5px;
          font-family: 'Inter', sans-serif;
          color: #1a1a2e;
          background-color: #f9fafb;
          resize: none;
          outline: none;
          line-height: 1.5;
          max-height: 80px;
        }

        .chat-input:focus {
          border-color: #1a5e20;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(26,94,32,0.08);
        }

        .chat-send {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background-color: #111827;
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background-color 0.15s;
        }

        .chat-send:disabled {
          background-color: #d1d5db;
          cursor: not-allowed;
        }

        .chat-send:not(:disabled):hover {
          background-color: #1f2937;
        }
      `}</style>

      {/* BOTÓN FLOTANTE */}
      {!abierto && (
        <button className="chat-fab" onClick={() => setAbierto(true)}>
          <span className="chat-fab-dot" />
          Asistente académico
        </button>
      )}

      {/* VENTANA */}
      {abierto && (
        <div className="chat-window">

          {/* CABECERA */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-header-icono">IA</div>
              <div>
                <span className="chat-header-titulo">Asistente Académico</span>
                <span className="chat-header-estado">
                  <span className="chat-estado-dot" />
                  {minimizado ? "Minimizado" : "En línea"}
                </span>
              </div>
            </div>
            <div className="chat-header-botones">
              <button className="chat-hbtn" onClick={limpiarChat} title="Limpiar conversación">↺</button>
              <button
                className="chat-hbtn"
                onClick={() => setMinimizado(!minimizado)}
                title={minimizado ? "Expandir" : "Minimizar"}
              >
                {minimizado ? "▲" : "▼"}
              </button>
              <button
                className="chat-hbtn"
                onClick={() => { setAbierto(false); setMinimizado(false); }}
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>

          {/* MENSAJES */}
          {!minimizado && (
            <>
              <div className="chat-body">
                {historial.map((msg, i) => (
                  <div key={i} className={`chat-msg ${msg.role === "user" ? "user" : "bot"}`}>
                    <div className="chat-burbuja">{msg.content}</div>
                  </div>
                ))}

                {cargando && (
                  <div className="chat-msg bot">
                    <div className="chat-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* INPUT */}
              <div className="chat-input-area">
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  value={mensaje}
                  onChange={e => setMensaje(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describí tu situación..."
                  rows={1}
                />
                <button
                  className="chat-send"
                  onClick={enviarMensaje}
                  disabled={cargando || !mensaje.trim()}
                >
                  &#9658;
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
