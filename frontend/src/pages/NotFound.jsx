import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui.jsx";

export default function NotFound() {
  return (
    <EmptyState text="Esta página se la llevó el perro.">
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </EmptyState>
  );
}