import { useState } from "react";
import { Link } from "react-router-dom";
import { Field, EmptyState } from "../ui.jsx";
import { useData } from "../../context/DataContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { TIMESLOTS, todayISO, isSunday, nowHHMM, formatPrice } from "../../utils/helpers.js";

export default function AppointmentForm({ onSubmit, onCancel }) {
  const { user } = useAuth();
  const { pets, services, users, appointments } = useData();

  const myPets = pets.filter((p) => p.ownerId === user.id);
  const vets = users.filter((u) => u.role === "veterinario" && u.active);
  const activeServices = services.filter((s) => s.active);

  const [form, setForm] = useState({
    petId: myPets[0]?.id ?? "",
    serviceId: activeServices[0]?.id ?? "",
    vetId: vets[0]?.id ?? "",
    date: todayISO(),
    time: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value, ...(k === "date" || k === "vetId" ? { time: "" } : {}) });

  if (!myPets.length) {
    return (
      <EmptyState text="Primero tenés que registrar una mascota.">
        <Link to="/mascotas" className="btn btn-primary">Agregar mascota</Link>
      </EmptyState>
    );
  }


  const taken = appointments
    .filter((a) => a.vetId === form.vetId && a.date === form.date && a.status !== "cancelado")
    .map((a) => a.time);
  const isPastSlot = (t) => form.date === todayISO() && t <= nowHHMM();
  const service = activeServices.find((s) => s.id === form.serviceId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSunday(form.date)) return setError("Los domingos la veterinaria está cerrada.");
    if (!form.time) return setError("Elegí un horario disponible.");
    onSubmit({ ...form, ownerId: user.id, status: "pendiente" });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <Field label="Mascota">
          <select value={form.petId} onChange={set("petId")}>
            {myPets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label="Servicio">
          <select value={form.serviceId} onChange={set("serviceId")}>
            {activeServices.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
      </div>
      <div className="form-row">
        <Field label="Profesional">
          <select value={form.vetId} onChange={set("vetId")}>
            {vets.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </Field>
        <Field label="Fecha">
          <input type="date" min={todayISO()} required value={form.date} onChange={set("date")} />
        </Field>
      </div>

      <div className="field">
        <span>Horario</span>
        <div className="slots">
          {TIMESLOTS.map((t) => {
            const disabled = taken.includes(t) || isPastSlot(t);
            return (
              <button
                type="button"
                key={t}
                disabled={disabled}
                className={`slot ${form.time === t ? "selected" : ""}`}
                onClick={() => setForm({ ...form, time: t })}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Motivo (opcional)">
        <input value={form.reason} onChange={set("reason")} placeholder="Ej: no quiere comer" />
      </Field>

      {service && <p className="muted small">Valor estimado: <strong>{formatPrice(service.price)}</strong> - {service.duration} min</p>}
      {error && <p className="alert">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary">Solicitar turno</button>
      </div>
    </form>
  );
}
