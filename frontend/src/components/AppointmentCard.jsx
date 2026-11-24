import { Link } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import { formatDate } from "../utils/helpers.js";
import { StatusBadge } from "./ui.jsx";

export default function AppointmentCard({ appointment: a, show = [], children }) {
  const { findPet, findService, findUser } = useData();
  const pet = findPet(a.petId);
  const service = findService(a.serviceId);
  const vet = findUser(a.vetId);
  const owner = findUser(a.ownerId);

  return (
    <div className={`card appt-card ${a.status === "cancelado" ? "is-cancelled" : ""}`}>
      <div className="appt-when">
        <strong>{a.time}</strong>
        <small>{formatDate(a.date)}</small>
      </div>

      <div className="appt-body">
        <div className="appt-title">
          {pet ? <Link to={`/pacientes/${pet.id}`}>{pet.name}</Link> : "Mascota eliminada"}
          <span className="muted">- {service?.name ?? "Servicio"}</span>
        </div>
        <div className="muted small">
          {show.includes("vet") && <>Atiende: {vet?.name ?? "—"} </>}
          {show.includes("owner") && <>Dueño/a: {owner?.name ?? "—"} </>}
          {a.reason && <>- “{a.reason}”</>}
        </div>
      </div>

      <StatusBadge status={a.status} />
      {children && <div className="appt-actions">{children}</div>}
    </div>
  );
}
