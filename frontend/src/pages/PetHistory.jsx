import { useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";
import { PageHeader, EmptyState } from "../components/ui.jsx";
import Modal from "../components/Modal.jsx";
import RecordForm from "../components/forms/RecordForm.jsx";
import { SPECIES, ageFrom, formatDate, todayISO } from "../utils/helpers.js";

export default function PetHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { findPet, findUser, records, add } = useData();
  const [adding, setAdding] = useState(false);

  const pet = findPet(id);
  if (!pet) return <EmptyState text="No encontramos esa mascota." />;
  if (user.role === "cliente" && pet.ownerId !== user.id) return <Navigate to="/mascotas" replace />;

  const owner = findUser(pet.ownerId);
  const history = records.filter((r) => r.petId === pet.id).sort((a, b) => b.date.localeCompare(a.date));

  const handleAdd = (data) => {
    add("records", { ...data, petId: pet.id, vetId: user.id, appointmentId: null, date: todayISO() });
    setAdding(false);
  };

  return (
    <>
      <button className="link-btn" onClick={() => navigate(-1)}>Volver</button>
      <PageHeader
        title={pet.name}
        subtitle="Historia clínica"
        action={user.role === "veterinario" && <button className="btn btn-primary" onClick={() => setAdding(true)}>+ Agregar nota</button>}
      />

      <div className="card pet-info">
        <div><small className="muted">Especie</small><b>{SPECIES[pet.species].label}</b></div>
        <div><small className="muted">Raza</small><b>{pet.breed || "—"}</b></div>
        <div><small className="muted">Edad</small><b>{ageFrom(pet.birthYear)}</b></div>
        <div><small className="muted">Peso</small><b>{pet.weight ? `${pet.weight} kg` : "—"}</b></div>
        <div><small className="muted">Dueño/a</small><b>{owner?.name ?? "—"}</b><small className="muted">{owner?.phone}</small></div>
      </div>

      <section>
        <h2>Visitas</h2>
        {history.length ? (
          <ol className="timeline">
            {history.map((r) => (
              <li key={r.id} className="card">
                <div className="timeline-head">
                  <strong>{formatDate(r.date)}</strong>
                  <span className="muted small">{findUser(r.vetId)?.name ?? "—"}</span>
                </div>
                <p><b>Diagnóstico:</b> {r.diagnosis}</p>
                {r.treatment && <p><b>Indicaciones:</b> {r.treatment}</p>}
                {r.nextControl && <p className="pill">Próximo control: {formatDate(r.nextControl)}</p>}
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState text="Todavía no hay visitas registradas." />
        )}
      </section>

      {adding && (
        <Modal title={`Nueva nota - ${pet.name}`} onClose={() => setAdding(false)}>
          <RecordForm onSubmit={handleAdd} onCancel={() => setAdding(false)} />
        </Modal>
      )}
    </>
  );
}