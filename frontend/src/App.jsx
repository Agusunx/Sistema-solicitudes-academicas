import { useState, useEffect } from "react";
import Login from "./Login.jsx";
import FormularioSolicitud from "./FormularioSolicitud.jsx";
import ListadoSolicitudes from "./ListadoSolicitudes.jsx";
import ChatAsistente from "./ChatAsistente.jsx";
import "./App.css";

const API_BASE = "http://localhost:3000";

// Descripción breve de cada tipo de solicitud
const TIPO_DESCRIPCIONES = {
  1:  "Solicitá un cambio de grupo o turno horario en una materia.",
  2:  "Pedí autorización para cursar sin tener aprobadas las correlativas.",
  3:  "Retomá tus estudios si fuiste dado de baja por regularidad.",
  4:  "Extendé el plazo de regularidad de una materia que está por vencer.",
  5:  "Solicitá el pase a otra carrera o a un turno diferente.",
  6:  "Pedí una constancia especial que no está disponible en el sistema.",
  7:  "Solicitá una nota oficial firmada por la institución.",
  8:  "Consultá si podés rendir equivalencias de materias de otras instituciones.",
  9:  "Realizá una consulta general sobre tu situación académica.",
  10: "Hacé seguimiento de una solicitud que ya presentaste.",
};



export default function App() {
  const [usuarioLogueado,  setUsuarioLogueado]  = useState(null);
  const [solicitudes,      setSolicitudes]      = useState([]);
  const [tiposSolicitud,   setTiposSolicitud]   = useState([]);
  const [pantalla,         setPantalla]         = useState("pendientes");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [errorLogin,       setErrorLogin]       = useState("");
  const [errorSolicitudes, setErrorSolicitudes] = useState("");

  // Al cargar la página, verificar si hay usuario guardado en localStorage
  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) setUsuarioLogueado(JSON.parse(guardado));
  }, []);

  // Cargar los tipos de solicitud desde la base de datos
  useEffect(() => {
    fetch(`${API_BASE}/tipos-solicitud`)
      .then((res) => res.json())
      .then((data) => setTiposSolicitud(Array.isArray(data) ? data : []))
      .catch(() => setTiposSolicitud([]));
  }, []);

  // Cargar solicitudes cuando hay un usuario logueado
  const obtenerSolicitudes = async () => {
    if (!usuarioLogueado) return;
    try {
      const res = await fetch(`${API_BASE}/solicitudes`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const lista = Array.isArray(data) ? data : [];

      // El estudiante solo ve sus propias solicitudes
      if (usuarioLogueado.rol === "Administrador") {
        setSolicitudes(lista);
      } else {
        setSolicitudes(lista.filter((s) => s.estudiante_id === usuarioLogueado.id));
      }
      setErrorSolicitudes("");
    } catch {
      setSolicitudes([]);
      setErrorSolicitudes("No se pudieron cargar las solicitudes. Verificá que el servidor esté corriendo.");
    }
  };

  useEffect(() => {
    if (usuarioLogueado) obtenerSolicitudes();
  }, [usuarioLogueado]);

  // Login
  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Credenciales incorrectas");

      setUsuarioLogueado(data);
      localStorage.setItem("usuario", JSON.stringify(data));
      setPantalla(data.rol === "Administrador" ? "pendientes" : "nueva");
      setErrorLogin("");
    } catch (e) {
      setErrorLogin(e.message);
    }
  };

  // Logout
  const handleLogout = () => {
    setUsuarioLogueado(null);
    localStorage.removeItem("usuario");
    setSolicitudes([]);
    setPantalla("pendientes");
    setTipoSeleccionado(null);
  };

  // Cambiar estado de una solicitud (solo Admin)
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await fetch(`${API_BASE}/solicitudes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      await obtenerSolicitudes();
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  // Si no hay usuario logueado, mostrar pantalla de login
  if (!usuarioLogueado) {
    return <Login handleLogin={handleLogin} errorLogin={errorLogin} />;
  }

  // Inicial del nombre para el avatar
  const inicial = usuarioLogueado.nombre?.charAt(0).toUpperCase() || "U";

  return (
    <div className="app-wrapper">
      <div className="app-container">

        {/* ── BARRA SUPERIOR ── */}
        <div className="topbar">
          <div className="topbar-brand">
            <span>Portal Académico</span>
            <span>Sistema de Gestión de Solicitudes</span>
          </div>
          <div className="topbar-user">
            <div className="topbar-avatar">{inicial}</div>
            <div>
              <div className="topbar-name">{usuarioLogueado.nombre}</div>
              <div className="topbar-role">{usuarioLogueado.rol}</div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>Salir</button>
          </div>
        </div>

        {errorSolicitudes && (
          <div className="toast-error">{errorSolicitudes}</div>
        )}

        {/* ══════════════ PANEL ADMINISTRADOR ══════════════ */}
        {usuarioLogueado.rol === "Administrador" && (
          <>
            <div className="nav-tabs">
              <button
                className={`nav-tab ${pantalla === "pendientes" ? "active" : ""}`}
                onClick={() => setPantalla("pendientes")}
              >
                Pendientes
              </button>
              <button
                className={`nav-tab ${pantalla === "revision" ? "active" : ""}`}
                onClick={() => setPantalla("revision")}
              >
                En revisión
              </button>
              <button
                className={`nav-tab ${pantalla === "respondidas" ? "active" : ""}`}
                onClick={() => setPantalla("respondidas")}
              >
                Respondidas
              </button>
            </div>

            {pantalla === "pendientes" && (
              <>
                <div className="section-header">
                  <h2 className="section-title">Pendientes</h2>
                  <span className="section-count">
                    {solicitudes.filter((s) => s.estado === "Pendiente").length} solicitudes
                  </span>
                </div>
                <ListadoSolicitudes
                  solicitudes={solicitudes.filter((s) => s.estado === "Pendiente")}
                  usuarioLogueado={usuarioLogueado}
                  actualizarEstado={actualizarEstado}
                />
              </>
            )}

            {pantalla === "revision" && (
              <>
                <div className="section-header">
                  <h2 className="section-title">En revisión</h2>
                  <span className="section-count">
                    {solicitudes.filter((s) => s.estado === "En revisión").length} solicitudes
                  </span>
                </div>
                <ListadoSolicitudes
                  solicitudes={solicitudes.filter((s) => s.estado === "En revisión")}
                  usuarioLogueado={usuarioLogueado}
                  actualizarEstado={actualizarEstado}
                />
              </>
            )}

            {pantalla === "respondidas" && (
              <>
                <div className="section-header">
                  <h2 className="section-title">Respondidas y cerradas</h2>
                  <span className="section-count">
                    {solicitudes.filter((s) => s.estado === "Respondida" || s.estado === "Cerrada").length} solicitudes
                  </span>
                </div>
                <ListadoSolicitudes
                  solicitudes={solicitudes.filter((s) => s.estado === "Respondida" || s.estado === "Cerrada")}
                  usuarioLogueado={usuarioLogueado}
                />
              </>
            )}
          </>
        )}

        {/* ══════════════ PANEL ESTUDIANTE ══════════════ */}
        {usuarioLogueado.rol === "Estudiante" && (
          <>
            <div className="nav-tabs">
              <button
                className={`nav-tab ${pantalla === "nueva" ? "active" : ""}`}
                onClick={() => { setPantalla("nueva"); setTipoSeleccionado(null); }}
              >
                Nueva solicitud
              </button>
              <button
                className={`nav-tab ${pantalla === "mis" ? "active" : ""}`}
                onClick={() => setPantalla("mis")}
              >
                Mis solicitudes
              </button>
            </div>

            {/* Grilla de tipos */}
            {pantalla === "nueva" && !tipoSeleccionado && (
              <>
                <div className="section-header">
                  <h2 className="section-title">¿Qué necesitás tramitar?</h2>
                  <span className="section-count">{tiposSolicitud.length} opciones</span>
                </div>
                <div className="tipos-grid">
                  {tiposSolicitud.map((tipo) => (
                    <div
                      key={tipo.id}
                      className="tipo-card"
                      onClick={() => setTipoSeleccionado(tipo)}
                    >
                      <h3>{tipo.nombre}</h3>
                      <p>{TIPO_DESCRIPCIONES[tipo.id] || "Iniciá esta solicitud."}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Formulario */}
            {pantalla === "nueva" && tipoSeleccionado && (
              <FormularioSolicitud
                usuario={usuarioLogueado}
                tipo={tipoSeleccionado}
                volver={() => setTipoSeleccionado(null)}
                obtenerSolicitudes={obtenerSolicitudes}
              />
            )}

            {/* Mis solicitudes */}
            {pantalla === "mis" && (
              <>
                <div className="section-header">
                  <h2 className="section-title">Mis solicitudes</h2>
                  <span className="section-count">{solicitudes.length} total</span>
                </div>
                <ListadoSolicitudes
                  solicitudes={solicitudes}
                  usuarioLogueado={usuarioLogueado}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Chat solo visible para estudiantes */}
      {usuarioLogueado.rol === "Estudiante" && <ChatAsistente />}
    </div>
  );
}