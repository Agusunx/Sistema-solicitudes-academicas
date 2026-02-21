// backend/src/sync.js

import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from './db/index.js';
import Usuario from './models/Usuario.js';
import TipoSolicitud from './models/TipoSolicitud.js';
import Solicitud from './models/Solicitud.js';
import Mensaje from './models/Mensaje.js';
import Historial from './models/Historial.js';

const syncDatabase = async () => {
  try {
    // Sincronizar todos los modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos');

    // -------------------------
    // 1. Usuarios de prueba
    // -------------------------
    const [admin, createdAdmin] = await Usuario.findOrCreate({
      where: { email: 'admin@uni.com' },
      defaults: { nombre: 'Admin', password: '1234', rol: 'Administrador' }
    });

    const [estudiante, createdEstudiante] = await Usuario.findOrCreate({
      where: { email: 'juan@uni.com' },
      defaults: { nombre: 'Juan Perez', password: '1234', rol: 'Estudiante' }
    });

    // -------------------------
    // 2. Tipos de solicitud
    // -------------------------
    const tiposSolicitud = [
      'Cambio de comisión',
      'Excepción a correlatividades',
      'Reincorporación a la carrera',
      'Prórroga de regularidad',
      'Cambio de carrera o turno',
      'Constancia institucional especial',
      'Nota institucional firmada',
      'Consulta por equivalencias',
      'Consulta académica',
      'Seguimiento de solicitud'
    ];

    for (const t of tiposSolicitud) {
      await TipoSolicitud.findOrCreate({ where: { nombre: t } });
    }

    // -------------------------
    // 3. Crear una solicitud de prueba
    // -------------------------
    const tipo = await TipoSolicitud.findOne({ where: { nombre: 'Cambio de comisión' } });

    const solicitud = await Solicitud.create({
      estudiante_id: estudiante.id,
      tipo_id: tipo.id,
      titulo: 'Quiero cambiar mi comisión',
      descripcion: 'Motivo: horario conflictivo',
      estado: 'Pendiente'
    });

    // -------------------------
    // 4. Crear un mensaje de prueba
    // -------------------------
    await Mensaje.create({
      solicitud_id: solicitud.id,
      usuario_id: estudiante.id,
      contenido: 'Hola, quisiera cambiar mi comisión.'
    });

    // -------------------------
    // 5. Crear un historial de prueba
    // -------------------------
    await Historial.create({
      solicitud_id: solicitud.id,
      usuario_id: admin.id,
      accion: 'Creación de solicitud',
      detalle: 'Se creó la solicitud con estado Pendiente'
    });

    console.log('✅ Datos de prueba insertados correctamente');

  } catch (error) {
    console.error('❌ Error sincronizando la base de datos:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Conexión a SQL cerrada');
  }
};

syncDatabase();
