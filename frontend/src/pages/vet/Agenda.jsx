import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { PageHeader, EmptyState } from "../../components/ui.jsx";
import Modal from "../../components/Modal.jsx";
import AppointmentCard from "../../components/AppointmentCard.jsx";
import RecordForm from "../../components/forms/RecordForm.jsx";
import { todayISO, addDays, formatDate, sortByDateTime } from "../../utils/helpers.js";

export default function Agenda() {
  const { user } = useAuth();
  const { appointments, update, add, findPet } = useData();
  const [date, setDate] = useState(todayISO());
  const [showAll, setShowAll] = useState(false);
  const [attending, setAttending] = useState(null);

  const list = appointments
    .filter((a) => a.vetId === user.id)
    .filter((a) => (showAll ? a.date >= todayISO() && a.status !== "cancelado" : a.date === date))
    .sort(sortByDateTime);

  const handleAttend = (record) => {
    add("records", { ...record, petId: attending.petId, vetId: user.id, appointmentId: attending.id, date: attending.date });
    update("appointments", attending.id, { status: "atendido" });
    setAttending(null);
  };

  return (
    <>
      <PageHeader title="Mi agenda" subtitle={showAll ? "Todos los turnos próximos" : formatDate(date)} />

      <div className="toolbar">
        <button className="btn btn-ghost" disabled={showAll} onClick={() => setDate(addDays(date, -1))}>←</button>
        <input type="date" value={date} disabled={showAll} onChange={(e) => setDate(e.target.value)} />
        <button className="btn btn-ghost" disabled={showAll} onClick={() => setDate(addDays(date, 1))}>→</button>
        <button className="btn btn-ghost" disabled={showAll} onClick={() => setDate(todayISO())}>Hoy</button>
        <label className="check">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          Ver todos los próximos
        </label>
      </div>

      {list.length ? (
        list.map((a) => (
          <AppointmentCard key={a.id} appointment={a} show={["owner"]}>
            {a.status === "pendiente" && (
              <button className="btn btn-soft" onClick={() => update("appointments", a.id, { status: "confirmado" })}>Confirmar</button>
            )}
            {["pendiente", "confirmado"].includes(a.status) && (
              <>
                <button className="btn btn-primary" onClick={() => setAttending(a)}>Atender</button>
                <button className="btn btn-danger-ghost" onClick={() => confirm("¿Cancelar el turno?") && update("appointments", a.id, { status: "cancelado" })}>Cancelar</button>
              </>
            )}
          </AppointmentCard>
        ))
      ) : (
        <EmptyState text="No hay turnos para mostrar." />
      )}

      {attending && (
        <Modal title={`Atender a ${findPet(attending.petId)?.name}`} onClose={() => setAttending(null)}>
          <RecordForm onSubmit={handleAttend} onCancel={() => setAttending(null)} />
        </Modal>
      )}
    </>
  );
}
