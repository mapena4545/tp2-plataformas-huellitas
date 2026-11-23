import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
            <span>Huellitas</span>
        </Link>

        <div className="nav-user">
          <Link to="/login" className="btn btn-ghost">Ingresar</Link>
          <Link to="/registro" className="btn btn-primary">Crear cuenta</Link>
        </div>
      </div>
    </header>
  );
}