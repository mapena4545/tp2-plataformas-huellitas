import { useState } from "react";
import { Field } from "../ui.jsx";
import { todayISO } from "../../utils/helpers.js";

export default function RecordForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ diagnosis: "", treatment: "", nextControl: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <Field label="Diagnóstico / observaciones">
        <textarea rows="3" required value={form.diagnosis} onChange={set("diagnosis")} />
      </Field>
      <Field label="Tratamiento / indicaciones">
        <textarea rows="3" value={form.treatment} onChange={set("treatment")} />
      </Field>
      <Field label="Próximo control (opcional)">
        <input type="date" min={todayISO()} value={form.nextControl} onChange={set("nextControl")} />
      </Field>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary">Guardar en historia clínica</button>
      </div>
    </form>
  );
}
