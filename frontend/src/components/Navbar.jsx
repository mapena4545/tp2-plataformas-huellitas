import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLES } from "../utils/helpers.js";

const LINKS = {
  cliente: [
    { to: "/panel", label: "Inicio" },
    { to: "/mascotas", label: "Mis mascotas" },
    { to: "/turnos", label: "Mis turnos" },
  ],
  veterinario: [
    { to: "/panel", label: "Inicio" },
    { to: "/agenda", label: "Agenda" },
    { to: "/pacientes", label: "Pacientes" },
  ],
  admin: [
    { to: "/panel", label: "Inicio" },
    { to: "/usuarios", label: "Usuarios" },
    { to: "/servicios", label: "Servicios" },
    { to: "/pacientes", label: "Pacientes" },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to={user ? "/panel" : "/"} className="brand">
          Huellitas
        </Link>

        {user && (
          <nav className="nav-links">
            {LINKS[user.role].map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="nav-user">
          {user ? (
            <>
              <div className="user-chip">
                <strong>{user.name}</strong>
                <small>{ROLES[user.role]}</small>
              </div>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
