import { useState } from "react";

const API_BASE = "http://localhost:3000";

export default function FormularioSolicitud({ usuario, tipo, volver, obtenerSolicitudes }) {
  const [titulo,   setTitulo]   = useState("");
  const [detalle,  setDetalle]  = useState("");
  const [exito,    setExito]    = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !detalle) {
      setError("Completá todos los campos antes de continuar.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id:  usuario.id,
          tipo_id:     tipo.id,
          titulo,
          descripcion: detalle,
        }),
      });

      if (!res.ok) throw new Error("Error al enviar la solicitud");

      setExito("¡Solicitud enviada correctamente!");
      setTitulo("");
      setDetalle("");
      setError("");
      obtenerSolicitudes();
      setTimeout(() => setExito(""), 3000);
    } catch {
      setError("No se pudo enviar la solicitud. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-card-title">{tipo.nombre}</h2>
      <p className="form-card-sub">Completá los campos para enviar tu solicitud.</p>

      {exito && <div className="toast-success">{exito}</div>}
      {error && <div className="toast-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Título de la solicitud</label>
          <input
            className="form-input"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Cambio de comisión por motivos laborales"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Detalle y justificación</label>
          <textarea
            className="form-textarea"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            placeholder="Describí tu situación con el mayor detalle posible..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-back" onClick={volver}>
            ← Volver
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>
        </div>
      </form>
    </div>
  );
}