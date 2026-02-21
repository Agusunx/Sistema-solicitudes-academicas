import Usuario from './Usuario.js';
import TipoSolicitud from './TipoSolicitud.js';
import Solicitud from './Solicitud.js';
import Mensaje from './Mensaje.js';
import Historial from './Historial.js';

// Una solicitud pertenece a un usuario (estudiante)
Solicitud.belongsTo(Usuario, { foreignKey: "estudiante_id", as: "Usuario" });

// Una solicitud pertenece a un tipo de solicitud
Solicitud.belongsTo(TipoSolicitud, { foreignKey: "tipo_id", as: "TipoSolicitud" });

export { Usuario, TipoSolicitud, Solicitud, Mensaje, Historial };
