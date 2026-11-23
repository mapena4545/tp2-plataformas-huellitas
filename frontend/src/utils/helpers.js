export const toISO = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export const todayISO = () => toISO(new Date());

export const addDays = (iso, days) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toISO(d);
};

export const isSunday = (iso) => new Date(iso + "T00:00:00").getDay() === 0;

export const formatDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const nowHHMM = () => new Date().toTimeString().slice(0, 5);

export const TIMESLOTS = Array.from({ length: 18 }, (_, i) => {
  const h = 9 + Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

export const formatPrice = (n) =>
  Number(n).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export const ageFrom = (birthYear) => {
  const years = new Date().getFullYear() - Number(birthYear);
  return years <= 0 ? "Menos de 1 año" : `${years} año${years > 1 ? "s" : ""}`;
};

export const ROLES = {
  admin: "Administrador/a",
  veterinario: "Veterinario/a",
  cliente: "Cliente",
};

export const STATUS = {
  pendiente: { label: "Pendiente", tone: "warn" },
  confirmado: { label: "Confirmado", tone: "info" },
  atendido: { label: "Atendido", tone: "ok" },
  cancelado: { label: "Cancelado", tone: "muted" },
};

export const SPECIES = {
  perro: { label: "Perro"},
  gato: { label: "Gato"},
  conejo: { label: "Conejo"},
  ave: { label: "Ave"},
  otro: { label: "Otro"},
};

export const sortByDateTime = (a, b) => (a.date + a.time).localeCompare(b.date + b.time);