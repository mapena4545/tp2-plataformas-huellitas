import { useAuth } from "../context/AuthContext.jsx";
import { PageHeader } from "../components/ui.jsx";
import { todayISO, formatDate, ROLES } from "../utils/helpers.js";

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user.name.replace(/^(Dr|Dra).\s/, "").split(" ")[0];

  return (
    <>
      <PageHeader title={`Hola, ${firstName}`} subtitle={formatDate(todayISO())} />
      <div className="card">
        Ingresaste como <strong>{ROLES[user.role]}</strong>. Desde el menú de arriba vas a
        poder entrar a las secciones de tu rol.
      </div>
    </>
  );
}