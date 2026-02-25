# Sistema de Gestión de Solicitudes Académicas

Plataforma web para gestionar solicitudes académicas entre estudiantes y la Secretaría. Incluye un asistente de inteligencia artificial que orienta al estudiante sobre qué tipo de solicitud realizar.

🌐 **Demo en vivo:** https://sistema-solicitudes-academicas.vercel.app

---

## Tecnologías utilizadas

- **Frontend:** React + Vite — deployado en Vercel
- **Backend:** Node.js + Express — deployado en Render
- **Base de datos:** MySQL + Sequelize ORM — deployado en Railway
- **Asistente IA:** Groq API (LLaMA 3.3)

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

---

## Instalación local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Agusunx/Sistema-solicitudes-academicas.git
cd Sistema-solicitudes-academicas
```

### 2. Configurar el backend
```bash
cd backend
npm install
```

Crear un archivo `.env` en la carpeta `backend/`:
```
DB_HOST=localhost
DB_PORT=3306
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

### 3. Configurar el frontend
```bash
cd ../frontend
npm install
npm run dev
```

Crear un archivo `.env` en la carpeta `frontend/`:
```
VITE_API_URL=http://localhost:3000
```

La aplicación queda disponible en `http://localhost:5173`

---

## Deploy

El proyecto está deployado con servicios gratuitos:

- **Base de datos:** [Railway](https://railway.app) — MySQL
- **Backend:** [Render](https://render.com) — Web Service
- **Frontend:** [Vercel](https://vercel.com) — proyecto Vite/React
