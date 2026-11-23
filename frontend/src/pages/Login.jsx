import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Field } from "../components/ui.jsx";

const DEMO = [
  { label: "Administrador", email: "admin@huellitas.com", password: "admin123" },
  { label: "Veterinario", email: "martin@huellitas.com", password: "vet123" },
  { label: "Cliente", email: "ana@mail.com", password: "cliente123" },
];

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/panel" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.ok) navigate("/panel");
    else setError(res.error);
  };

  return (
    <div className="auth">
      <div className="card auth-card">
        <h1>Ingresar</h1>
        <form className="form" onSubmit={handleSubmit}>
          <Field label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Contraseña">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error && <p className="alert">{error}</p>}
          <button className="btn btn-primary btn-block">Ingresar</button>
        </form>
        <p className="muted small center">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>

        <div className="demo">
          <p className="small"><strong>Cuentas de prueba</strong> (click para completar)</p>
          <div className="demo-buttons">
            {DEMO.map((d) => (
              <button key={d.email} type="button" className="btn btn-soft" onClick={() => { setEmail(d.email); setPassword(d.password); setError(""); }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}