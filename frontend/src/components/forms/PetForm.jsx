import { useState } from "react";
import { Field } from "../ui.jsx";
import { SPECIES } from "../../utils/helpers.js";

const EMPTY = { name: "", species: "perro", breed: "", birthYear: new Date().getFullYear(), weight: "" };

export default function PetForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, name: form.name.trim(), birthYear: Number(form.birthYear), weight: Number(form.weight) || "" });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Field label="Nombre">
        <input required value={form.name} onChange={set("name")} placeholder="Ej: Toby" />
      </Field>
      <div className="form-row">
        <Field label="Especie">
          <select value={form.species} onChange={set("species")}>
            {Object.entries(SPECIES).map(([k, s]) => (
              <option key={k} value={k}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Raza">
          <input value={form.breed} onChange={set("breed")} placeholder="Opcional" />
        </Field>
      </div>
      <div className="form-row">
        <Field label="Año de nacimiento">
          <input type="number" required min="1990" max={new Date().getFullYear()} value={form.birthYear} onChange={set("birthYear")} />
        </Field>
        <Field label="Peso (kg)">
          <input type="number" step="0.1" min="0" value={form.weight} onChange={set("weight")} />
        </Field>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
}
