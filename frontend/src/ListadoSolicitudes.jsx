// Prioridad según el tipo de solicitud (solo visible para el Administrador)
// Alta: tipos que suelen ser urgentes o requieren documentación oficial
// Media: trámites que necesitan evaluación académica
// Baja: consultas y cambios de baja complejidad

const PRIORIDAD_POR_TIPO = {
  3: "Alta",  // Reincorporación a la carrera
  6: "Alta",  // Constancia institucional especial
  7: "Alta",  // Nota institucional firmada
  2: "Media", // Excepción a correlatividades
  4: "Media", // Prórroga de regularidad
  8: "Media", // Consulta por equivalencias
  1: "Baja",  // Cambio de comisión
  5: "Baja",  // Cambio de carrera o turno
  9: "Baja",  // Consulta académica
  10: "Baja", // Seguimiento de solicitud
};

// Para ordenar: Alta = 3, Media = 2, Baja = 1
const ORDEN_PRIORIDAD = { Alta: 3, Media: 2, Baja: 1 };

function getPrioridad(tipo_id) {
  return PRIORIDAD_POR_TIPO[tipo_id] || "Baja";
}

function getBadgeEstado(estado) {
  const clases = {
    "Pendiente":   "badge badge-pendiente",
    "En revisión": "badge badge-revision",
    "Respondida":  "badge badge-respondida",
    "Cerrada":     "badge badge-cerrada",
  };
  return clases[estado] || "badge";
}

function getBadgePrioridad(prioridad) {
  const clases = {
    "Alta":  "badge badge-alta",
    "Media": "badge badge-media",
    "Baja":  "badge badge-baja",
  };
  return clases[prioridad] || "badge badge-baja";
}

export default function ListadoSolicitudes({ solicitudes, usuarioLogueado, actualizarEstado }) {
  if (!solicitudes || solicitudes.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay solicitudes para mostrar.</p>
      </div>
    );
  }

  // Si es administrador, ordenar por prioridad (Alta primero)
  let listaMostrar = [...solicitudes];
  if (usuarioLogueado.rol === "Administrador") {
    listaMostrar.sort((a, b) => {
      const pA = ORDEN_PRIORIDAD[getPrioridad(a.tipo_id)] || 1;
      const pB = ORDEN_PRIORIDAD[getPrioridad(b.tipo_id)] || 1;
      return pB - pA; // descendente: Alta primero
    });
  }

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Estudiante</th>
            <th>Tipo</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Estado</th>
            {usuarioLogueado.rol === "Administrador" && <th>Prioridad</th>}
            {usuarioLogueado.rol === "Administrador" && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {listaMostrar.map((sol) => {
            const prioridad = getPrioridad(sol.tipo_id);
            const esAlta = prioridad === "Alta";

            return (
              <tr key={sol.id} className={esAlta && usuarioLogueado.rol === "Administrador" ? "fila-alta" : ""}>
                <td style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600 }}>
                  #{sol.id}
                </td>
                <td style={{ fontWeight: 600, color: "#1a1a2e" }}>
                  {sol.Usuario?.nombre || "—"}
                </td>
                <td style={{ fontSize: "13px" }}>
                  {sol.TipoSolicitud?.nombre || "—"}
                </td>
                <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {sol.titulo}
                </td>
                <td style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#6b7280", fontSize: "13px" }}
                    title={sol.descripcion}>
                  {sol.descripcion}
                </td>
                <td>
                  <span className={getBadgeEstado(sol.estado)}>
                    {sol.estado}
                  </span>
                </td>

                {/* Columna de prioridad — solo Admin */}
                {usuarioLogueado.rol === "Administrador" && (
                  <td>
                    <span className={getBadgePrioridad(prioridad)}>
                      {prioridad}
                    </span>
                  </td>
                )}

                {/* Columna de acciones — solo Admin */}
                {usuarioLogueado.rol === "Administrador" && (
                  <td>
                    {sol.estado === "Pendiente" && (
                      <button
                        className="btn-accion btn-accion-primary"
                        onClick={() => actualizarEstado(sol.id, "En revisión")}
                      >
                        Revisar
                      </button>
                    )}
                    {sol.estado === "En revisión" && (
                      <>
                        <button
                          className="btn-accion btn-accion-primary"
                          onClick={() => actualizarEstado(sol.id, "Respondida")}
                        >
                          Responder
                        </button>
                        <button
                          className="btn-accion btn-accion-danger"
                          onClick={() => actualizarEstado(sol.id, "Cerrada")}
                        >
                          Cerrar
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}