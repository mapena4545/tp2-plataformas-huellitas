import { useState } from "react";
import { Field } from "../ui.jsx";
import { ROLES } from "../../utils/helpers.js";
import { useData } from "../../context/DataContext.jsx";

const EMPTY = { name: "", email: "", phone: "", password: "", role: "cliente", active: true };

export default function UserForm({ initial, onSubmit, onCancel }) {
  const { users } = useData();
  const [form, setForm] = useState(initial ? { ...initial, password: "" } : EMPTY);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === email && u.id !== initial?.id)) {
      return setError("Ese email ya está en uso.");
    }
    if (!initial && form.password.length < 4) return setError("La contraseña debe tener al menos 4 caracteres.");

    const data = { ...form, email: form.email.trim() };
    if (initial && !form.password) delete data.password; 
    delete data.id;
    onSubmit(data);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Field label="Nombre completo">
        <input required value={form.name} onChange={set("name")} />
      </Field>
      <div className="form-row">
        <Field label="Email">
          <input type="email" required value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Teléfono">
          <input value={form.phone} onChange={set("phone")} />
        </Field>
      </div>
      <div className="form-row">
        <Field label="Rol">
          <select value={form.role} onChange={set("role")}>
            {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <Field label={initial ? "Nueva contraseña (opcional)" : "Contraseña"}>
          <input type="password" value={form.password} onChange={set("password")} />
        </Field>
      </div>
      <label className="check">
        <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
        Cuenta activa
      </label>
      {error && <p className="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
}
