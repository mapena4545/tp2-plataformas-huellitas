import { useState } from "react";
import { Field } from "../ui.jsx";

const EMPTY = { name: "", description: "", price: "", duration: 30, active: true };

export default function ServiceForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, ...data } = form;
    onSubmit({ ...data, price: Number(form.price), duration: Number(form.duration) });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Field label="Nombre del servicio">
        <input required value={form.name} onChange={set("name")} />
      </Field>
      <Field label="Descripción">
        <textarea rows="2" value={form.description} onChange={set("description")} />
      </Field>
      <div className="form-row">
        <Field label="Precio ($)">
          <input type="number" min="0" required value={form.price} onChange={set("price")} />
        </Field>
        <Field label="Duración (min)">
          <select value={form.duration} onChange={set("duration")}>
            {[15, 30, 45, 60, 90].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
      </div>
      <label className="check">
        <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
        Visible para reservar
      </label>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
}
