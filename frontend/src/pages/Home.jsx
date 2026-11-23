import { Link } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { formatPrice } from "../utils/helpers.js";

export default function Home() {
  const { services } = useData();

  return (
    <>
      <section className="hero">
        <div>
          <span className="pill">Veterinaria de barrio - desde 2023</span>
          <h1>Turnos e historia clínica de tu mascota, en un solo lugar.</h1>
          <p className="muted">
            En Huellitas sacás turno online, ves los horarios libres de cada profesional y
            consultás las indicaciones de cada visita sin perder papelitos.
          </p>
          <div className="hero-actions">
            <Link to="/registro" className="btn btn-primary btn-lg">Sacar turno</Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Ya tengo cuenta</Link>
          </div>
        </div>
      </section>

      <section>
        <h2>Servicios</h2>
        <div className="grid grid-4">
          {services.filter((s) => s.active).map((s) => (
            <div key={s.id} className="card service-card">
              <h3>{s.name}</h3>
              <p className="muted small">{s.description}</p>
              <div className="service-meta">
                <strong>{formatPrice(s.price)}</strong>
                <span className="muted small">{s.duration} min</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>¿Cómo funciona?</h2>
        <div className="grid grid-3">
          <div className="card step"><b>1</b><h3>Registrate</h3><p className="muted small">Creá tu cuenta y cargá a tus mascotas.</p></div>
          <div className="card step"><b>2</b><h3>Pedí turno</h3><p className="muted small">Elegí servicio, profesional y un horario libre.</p></div>
          <div className="card step"><b>3</b><h3>Seguimiento</h3><p className="muted small">Consultá diagnósticos, tratamientos y próximos controles.</p></div>
        </div>
      </section>
    </>
  );
}