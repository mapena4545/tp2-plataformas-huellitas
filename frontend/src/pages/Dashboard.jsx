import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";
import { PageHeader, StatCard, EmptyState } from "../components/ui.jsx";
import AppointmentCard from "../components/AppointmentCard.jsx";
import { todayISO, formatDate, sortByDateTime } from "../utils/helpers.js";

const isActive = (a) => ["pendiente", "confirmado"].includes(a.status);

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user.name.replace(/^(Dr|Dra)\.\s/, "").split(" ")[0];

  return (
    <>
      <PageHeader title={`Hola, ${firstName}`} subtitle={formatDate(todayISO())} />
      {user.role === "cliente" && <ClientDashboard />}
      {user.role === "veterinario" && <VetDashboard />}
    </>
  );
}

function ClientDashboard() {
  const { user } = useAuth();
  const { pets, appointments } = useData();
  const myPets = pets.filter((p) => p.ownerId === user.id);
  const upcoming = appointments
    .filter((a) => a.ownerId === user.id && isActive(a) && a.date >= todayISO())
    .sort(sortByDateTime);

  return (
    <>
      <div className="grid grid-3">
        <StatCard label="Mascotas" value={myPets.length} />
        <StatCard label="Próximos turnos" value={upcoming.length} />
      </div>

      <section>
        <div className="section-head">
          <h2>Próximos turnos</h2>
          <Link to="/turnos" className="btn btn-primary">+ Pedir turno</Link>
        </div>
        {upcoming.length ? (
          upcoming.map((a) => <AppointmentCard key={a.id} appointment={a} show={["vet"]} />)
        ) : (
          <EmptyState text="No tenés turnos próximos." />
        )}
      </section>
    </>
  );
}

function VetDashboard() {
  const { user } = useAuth();
  const { appointments } = useData();
  const mine = appointments.filter((a) => a.vetId === user.id);
  const today = mine.filter((a) => a.date === todayISO() && a.status !== "cancelado").sort(sortByDateTime);
  const toConfirm = mine.filter((a) => a.status === "pendiente" && a.date >= todayISO());
  const month = todayISO().slice(0, 7);
  const attendedMonth = mine.filter((a) => a.status === "atendido" && a.date.startsWith(month));

  return (
    <>
      <div className="grid grid-3">
        <StatCard label="Turnos de hoy" value={today.length} />
        <StatCard label="Por confirmar" value={toConfirm.length} />
        <StatCard label="Atendidos este mes" value={attendedMonth.length} />
      </div>
      <section>
        <div className="section-head">
          <h2>Agenda de hoy</h2>
          <Link to="/agenda" className="btn btn-ghost">Ver agenda completa</Link>
        </div>
        {today.length ? (
          today.map((a) => <AppointmentCard key={a.id} appointment={a} show={["owner"]} />)
        ) : (
          <EmptyState text="No tenés turnos para hoy." />
        )}
      </section>
    </>
  );
}