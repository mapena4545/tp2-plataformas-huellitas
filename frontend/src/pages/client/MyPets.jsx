import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { PageHeader, EmptyState } from "../../components/ui.jsx";
import Modal from "../../components/Modal.jsx";
import PetForm from "../../components/forms/PetForm.jsx";
import { SPECIES, ageFrom } from "../../utils/helpers.js";

export default function MyPets() {
  const { user } = useAuth();
  const { pets, add, update, removePet } = useData();
  const [editing, setEditing] = useState(null); 

  const myPets = pets.filter((p) => p.ownerId === user.id);

  const handleSave = (data) => {
    if (editing.id) update("pets", editing.id, data);
    else add("pets", { ...data, ownerId: user.id });
    setEditing(null);
  };

  const handleDelete = (pet) => {
    if (confirm(`¿Eliminar a ${pet.name}? Se borrarán también sus turnos e historia clínica.`)) removePet(pet.id);
  };

  return (
    <>
      <PageHeader
        title="Mis mascotas"
        subtitle="Cargá a tus mascotas para poder pedirles turno."
        action={<button className="btn btn-primary" onClick={() => setEditing({})}>+ Agregar mascota</button>}
      />

      {myPets.length ? (
        <div className="grid grid-3">
          {myPets.map((p) => (
            <div key={p.id} className="card pet-card">
              <h3>{p.name}</h3>
              <p className="muted small">
                {SPECIES[p.species].label}{p.breed && ` - ${p.breed}`} - {ageFrom(p.birthYear)}{p.weight && ` - ${p.weight} kg`}
              </p>
              <div className="card-actions">
                <Link to={`/pacientes/${p.id}`} className="btn btn-soft">Historia clínica</Link>
                <button className="btn btn-ghost" onClick={() => setEditing(p)}>Editar</button>
                <button className="btn btn-danger-ghost" onClick={() => handleDelete(p)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState text="Todavía no cargaste ninguna mascota." />
      )}

      {editing && (
        <Modal title={editing.id ? `Editar a ${editing.name}` : "Nueva mascota"} onClose={() => setEditing(null)}>
          <PetForm initial={editing.id ? editing : null} onSubmit={handleSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </>
  );
}
