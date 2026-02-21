# Sistema de Gestión de Solicitudes Académicas

Plataforma web para gestionar solicitudes académicas entre estudiantes y la Secretaría. Incluye un asistente de inteligencia artificial que orienta al estudiante sobre qué tipo de solicitud realizar.

---

## Tecnologías utilizadas

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Base de datos:** MySQL + Sequelize ORM
- **Asistente IA:** Groq API (LLaMA 3.3)

---

## Requisitos previos

- Node.js v18 o superior
- MySQL 8.0 o superior
- Una API key de [Groq](https://console.groq.com)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Agusunx/Sistema-solicitudes-academicas.git
cd Sistema-solicitudes-academicas
```

### 2. Configurar la base de datos

Importar los archivos SQL en este orden desde MySQL Workbench o la terminal:

```
sistema_solicitudes_academicas_usuarios.sql
sistema_solicitudes_academicas_tipossolicitud.sql
sistema_solicitudes_academicas_solicitudes.sql
sistema_solicitudes_academicas_mensajes.sql
sistema_solicitudes_academicas_historial.sql
```

### 3. Configurar el backend

```bash
cd backend
npm install
```

Crear un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=sistema_solicitudes_academicas
GROQ_API_KEY=tu_api_key_de_groq
PORT=3000
```

Iniciar el servidor:

```bash
npm run dev
```

### 4. Configurar el frontend

```bash
cd ../frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`

---

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@uni.com | 1234 |
| Estudiante | juan@uni.com | 1234 |

---

## Funcionalidades

**Estudiante**
- Crear solicitudes académicas seleccionando el tipo desde una grilla
- Consultar el estado de sus solicitudes
- Usar el asistente de IA para orientarse antes de crear una solicitud

**Administrador**
- Ver todas las solicitudes filtradas por estado
- Ver el nivel de prioridad de cada solicitud (Alta, Media, Baja)
- Las solicitudes de prioridad Alta aparecen primero
- Cambiar el estado de una solicitud (Pendiente → En revisión → Respondida / Cerrada)
