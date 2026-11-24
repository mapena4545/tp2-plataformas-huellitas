import { useState } from "react";
import { useData } from "../../context/DataContext.jsx";
import { PageHeader, EmptyState } from "../../components/ui.jsx";
import Modal from "../../components/Modal.jsx";
import ServiceForm from "../../components/forms/ServiceForm.jsx";
import { formatPrice } from "../../utils/helpers.js";

export default function Services() {
  const { services, appointments, add, update, remove } = useData();
  const [editing, setEditing] = useState(null);

  const handleSave = (data) => {
    if (editing.id) update("services", editing.id, data);
    else add("services", data);
    setEditing(null);
  };

  const handleDelete = (s) => {
    if (appointments.some((a) => a.serviceId === s.id)) {
      alert("Este servicio tiene turnos asociados. Podés ocultarlo desmarcando “Visible para reservar”.");
      return;
    }
    if (confirm(`¿Eliminar "${s.name}"?`)) remove("services", s.id);
  };

  return (
    <>
      <PageHeader
        title="Servicios"
        subtitle="Lo que ofrece la veterinaria y su precio de referencia."
        action={<button className="btn btn-primary" onClick={() => setEditing({})}>+ Nuevo servicio</button>}
      />

      {services.length ? (
        <div className="grid grid-3">
          {services.map((s) => (
            <div key={s.id} className={`card service-card ${s.active ? "" : "is-cancelled"}`}>
              <div className="section-head">
                <h3>{s.name}</h3>
                {!s.active && <span className="badge badge-muted">Oculto</span>}
              </div>
              <p className="muted small">{s.description}</p>
              <div className="service-meta">
                <strong>{formatPrice(s.price)}</strong>
                <span className="muted small">{s.duration} min - {appointments.filter((a) => a.serviceId === s.id).length} turnos</span>
              </div>
              <div className="card-actions">
                <button className="btn btn-ghost" onClick={() => setEditing(s)}>Editar</button>
                <button className="btn btn-danger-ghost" onClick={() => handleDelete(s)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState text="No hay servicios cargados." />
      )}

      {editing && (
        <Modal title={editing.id ? "Editar servicio" : "Nuevo servicio"} onClose={() => setEditing(null)}>
          <ServiceForm initial={editing.id ? editing : null} onSubmit={handleSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </>
  );
}
