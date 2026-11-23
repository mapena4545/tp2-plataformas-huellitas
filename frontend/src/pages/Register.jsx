import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Field } from "../components/ui.jsx";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (user) return <Navigate to="/panel" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password.length < 4) return setError("La contraseña debe tener al menos 4 caracteres.");
    if (form.password !== form.confirm) return setError("Las contraseñas no coinciden.");
    const res = register(form);
    if (res.ok) navigate("/mascotas");
    else setError(res.error);
  };

  return (
    <div className="auth">
      <div className="card auth-card">
        <h1>Crear cuenta</h1>
        <form className="form" onSubmit={handleSubmit}>
          <Field label="Nombre y apellido">
            <input required value={form.name} onChange={set("name")} />
          </Field>
          <Field label="Email">
            <input type="email" required value={form.email} onChange={set("email")} />
          </Field>
          <Field label="Teléfono">
            <input value={form.phone} onChange={set("phone")} />
          </Field>
          <div className="form-row">
            <Field label="Contraseña">
              <input type="password" required value={form.password} onChange={set("password")} />
            </Field>
            <Field label="Repetir contraseña">
              <input type="password" required value={form.confirm} onChange={set("confirm")} />
            </Field>
          </div>
          {error && <p className="alert">{error}</p>}
          <button className="btn btn-primary btn-block">Registrarme</button>
        </form>
        <p className="muted small center">
          ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
        </p>
      </div>
    </div>
  );
}
