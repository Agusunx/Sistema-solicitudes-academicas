import { useState } from "react";

export default function Login({ handleLogin, errorLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    await handleLogin(email, password);
    setLoading(false);
  };

  return (
    <div className="login-page">

      {/* FORMULARIO */}
      <div className="login-left">
        <div className="login-form-wrap">

          <h1 className="login-heading">Bienvenido</h1>
          <p className="login-sub">Ingresá a tu cuenta para gestionar tus solicitudes académicas.</p>

          <form className="login-form" onSubmit={onSubmit}>
            <div>
              <label className="login-label">Correo electrónico</label>
              <input
                className="login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@uni.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="login-label">Contraseña</label>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {errorLogin && (
              <div className="login-error">{errorLogin}</div>
            )}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="login-right">
        <div className="login-right-glow" />
        <div className="login-right-content">
          <div className="login-right-badge">
            <span className="login-badge-dot" /> Sistema activo
          </div>
          <h2>Gestión de Solicitudes Académicas</h2>
          <p>Enviá, gestioná y hacé seguimiento de tus solicitudes desde un solo lugar.</p>
          <div className="login-features">
            <div className="login-feature">
              <div className="login-feature-dot" />
              Seguimiento de estado en tiempo real
            </div>
            <div className="login-feature">
              <div className="login-feature-dot" />
              Asistente de IA para orientarte
            </div>
            <div className="login-feature">
              <div className="login-feature-dot" />
              Gestión por prioridad para administradores
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}