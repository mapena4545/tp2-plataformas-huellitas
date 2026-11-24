import { useState } from "react";
import { useData } from "../../context/DataContext.jsx";
import { PageHeader, EmptyState } from "../../components/ui.jsx";
import AppointmentCard from "../../components/AppointmentCard.jsx";
import { STATUS, sortByDateTime } from "../../utils/helpers.js";

export default function AllAppointments() {
  const { appointments, users, update } = useData();
  const [status, setStatus] = useState("");
  const [vetId, setVetId] = useState("");

  const vets = users.filter((u) => u.role === "veterinario");
  const list = appointments
    .filter((a) => (!status || a.status === status) && (!vetId || a.vetId === vetId))
    .sort(sortByDateTime)
    .reverse();

  return (
    <>
      <PageHeader title="Todos los turnos" subtitle={`${list.length} turnos`} />

      <div className="toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
        </select>
        <select value={vetId} onChange={(e) => setVetId(e.target.value)}>
          <option value="">Todos los profesionales</option>
          {vets.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      {list.length ? (
        list.map((a) => (
          <AppointmentCard key={a.id} appointment={a} show={["vet", "owner"]}>
            <select
              aria-label="Cambiar estado"
              value={a.status}
              onChange={(e) => update("appointments", a.id, { status: e.target.value })}
            >
              {Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
          </AppointmentCard>
        ))
      ) : (
        <EmptyState text="No hay turnos con esos filtros." />
      )}
    </>
  );
}
