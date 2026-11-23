import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { PageHeader, EmptyState } from "../../components/ui.jsx";
import Modal from "../../components/Modal.jsx";
import AppointmentCard from "../../components/AppointmentCard.jsx";
import AppointmentForm from "../../components/forms/AppointmentForm.jsx";
import { todayISO, sortByDateTime } from "../../utils/helpers.js";

export default function MyAppointments() {
  const { user } = useAuth();
  const { appointments, add, update } = useData();
  const [tab, setTab] = useState("proximos");
  const [creating, setCreating] = useState(false);

  const mine = appointments.filter((a) => a.ownerId === user.id);
  const upcoming = mine
    .filter((a) => a.date >= todayISO() && ["pendiente", "confirmado"].includes(a.status))
    .sort(sortByDateTime);
  const history = mine.filter((a) => !upcoming.includes(a)).sort(sortByDateTime).reverse();
  const list = tab === "proximos" ? upcoming : history;

  const handleCreate = (data) => {
    add("appointments", data);
    setCreating(false);
    setTab("proximos");
  };

  const handleCancel = (a) => {
    if (confirm("¿Cancelar este turno?")) update("appointments", a.id, { status: "cancelado" });
  };

  return (
    <>
      <PageHeader
        title="Mis turnos"
        action={<button className="btn btn-primary" onClick={() => setCreating(true)}>+ Pedir turno</button>}
      />

      <div className="tabs">
        <button className={tab === "proximos" ? "active" : ""} onClick={() => setTab("proximos")}>Próximos ({upcoming.length})</button>
        <button className={tab === "historial" ? "active" : ""} onClick={() => setTab("historial")}>Historial ({history.length})</button>
      </div>

      {list.length ? (
        list.map((a) => (
          <AppointmentCard key={a.id} appointment={a} show={["vet"]}>
            {tab === "proximos" && (
              <button className="btn btn-danger-ghost" onClick={() => handleCancel(a)}>Cancelar</button>
            )}
          </AppointmentCard>
        ))
      ) : (
        <EmptyState text={tab === "proximos" ? "No tenés turnos próximos." : "Sin turnos anteriores."} />
      )}

      {creating && (
        <Modal title="Pedir turno" onClose={() => setCreating(false)}>
          <AppointmentForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </Modal>
      )}
    </>
  );
}
