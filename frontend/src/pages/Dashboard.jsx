import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";
import { PageHeader, StatCard, EmptyState } from "../components/ui.jsx";
import AppointmentCard from "../components/AppointmentCard.jsx";
import { todayISO, formatDate, formatPrice, sortByDateTime, STATUS } from "../utils/helpers.js";

const isActive = (a) => ["pendiente", "confirmado"].includes(a.status);

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user.name.replace(/^(Dr|Dra)\.\s/, "").split(" ")[0];

  return (
    <>
      <PageHeader title={`Hola, ${firstName}`} subtitle={formatDate(todayISO())} />
      {user.role === "cliente" && <ClientDashboard />}
      {user.role === "veterinario" && <VetDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </>
  );
}

function ClientDashboard() {
  const { user } = useAuth();
  const { pets, appointments, records } = useData();
  const myPets = pets.filter((p) => p.ownerId === user.id);
  const myPetIds = myPets.map((p) => p.id);
  const upcoming = appointments
    .filter((a) => a.ownerId === user.id && isActive(a) && a.date >= todayISO())
    .sort(sortByDateTime);
  const reminders = records
    .filter((r) => myPetIds.includes(r.petId) && r.nextControl && r.nextControl >= todayISO())
    .sort((a, b) => a.nextControl.localeCompare(b.nextControl));

  return (
    <>
      <div className="grid grid-3">
        <StatCard label="Mascotas" value={myPets.length} />
        <StatCard label="Próximos turnos" value={upcoming.length} />
        <StatCard label="Controles pendientes" value={reminders.length} />
      </div>

      {reminders.length > 0 && (
        <section>
          <h2>Recordatorios</h2>
          {reminders.map((r) => (
            <div key={r.id} className="card reminder">
              <strong>{myPets.find((p) => p.id === r.petId)?.name}</strong> tiene control el{" "}
              <strong>{formatDate(r.nextControl)}</strong>. <Link to="/turnos">Pedir turno</Link>
            </div>
          ))}
        </section>
      )}

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

function AdminDashboard() {
  const { users, pets, appointments, findService, resetDemo } = useData();
  const income = appointments
    .filter((a) => a.status === "atendido")
    .reduce((sum, a) => sum + (findService(a.serviceId)?.price ?? 0), 0);
  const byStatus = Object.keys(STATUS).map((s) => ({ s, n: appointments.filter((a) => a.status === s).length }));
  const total = appointments.length || 1;

  return (
    <>
      <div className="grid grid-4">
        <StatCard label="Usuarios" value={users.length} />
        <StatCard label="Mascotas" value={pets.length} />
        <StatCard label="Turnos" value={appointments.length} />
        <StatCard label="Facturado (atendidos)" value={formatPrice(income)} />
      </div>

      <section className="card">
        <h2>Turnos por estado</h2>
        {byStatus.map(({ s, n }) => (
          <div key={s} className="bar-row">
            <span>{STATUS[s].label}</span>
            <div className="bar"><div className={`bar-fill tone-${STATUS[s].tone}`} style={{ width: `${(n / total) * 100}%` }} /></div>
            <strong>{n}</strong>
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Datos de demostración</h2>
        <p className="muted small">Los datos se guardan en el navegador (localStorage). Podés volver a los datos iniciales en cualquier momento.</p>
        <button className="btn btn-ghost" onClick={() => confirm("¿Restaurar los datos de ejemplo?") && resetDemo()}>
          Restaurar datos de ejemplo
        </button>
      </section>
    </>
  );
}