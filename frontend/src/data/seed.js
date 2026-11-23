import { addDays, todayISO } from "../utils/helpers.js";

export function createSeed() {
  const t = todayISO();

  return {
    users: [
      { id: "u1", name: "Laura Gómez", email: "admin@huellitas.com", password: "admin123", phone: "11 4555-0001", role: "admin", active: true },
      { id: "u2", name: "Dr. Martín Ruiz", email: "martin@huellitas.com", password: "vet123", phone: "11 4555-0002", role: "veterinario", active: true },
      { id: "u3", name: "Dra. Sofía Paz", email: "sofia@huellitas.com", password: "vet123", phone: "11 4555-0003", role: "veterinario", active: true },
      { id: "u4", name: "Ana López", email: "ana@mail.com", password: "cliente123", phone: "11 6000-1234", role: "cliente", active: true },
      { id: "u5", name: "Diego Fernández", email: "diego@mail.com", password: "cliente123", phone: "11 6000-5678", role: "cliente", active: true },
    ],

    services: [
      { id: "s1", name: "Consulta general", description: "Revisión clínica completa y control de peso.", price: 15000, duration: 30, active: true },
      { id: "s2", name: "Vacunación", description: "Aplicación de vacunas y registro en libreta sanitaria.", price: 12000, duration: 30, active: true },
      { id: "s3", name: "Baño y corte", description: "Higiene, corte de pelo y uñas.", price: 18000, duration: 60, active: true },
      { id: "s4", name: "Control post-operatorio", description: "Seguimiento después de una cirugía.", price: 10000, duration: 30, active: true },
    ],

    pets: [
      { id: "p1", ownerId: "u4", name: "Toby", species: "perro", breed: "Caniche", birthYear: 2019, weight: 6.5 },
      { id: "p2", ownerId: "u4", name: "Mishi", species: "gato", breed: "Común europeo", birthYear: 2021, weight: 4.2 },
      { id: "p3", ownerId: "u5", name: "Rocco", species: "perro", breed: "Labrador", birthYear: 2016, weight: 31 },
    ],

    appointments: [
      { id: "a1", petId: "p1", ownerId: "u4", vetId: "u2", serviceId: "s2", date: t, time: "10:00", reason: "Refuerzo antirrábica", status: "confirmado" },
      { id: "a2", petId: "p3", ownerId: "u5", vetId: "u2", serviceId: "s1", date: t, time: "11:30", reason: "Cojea de la pata trasera", status: "pendiente" },
      { id: "a3", petId: "p2", ownerId: "u4", vetId: "u3", serviceId: "s3", date: addDays(t, 2), time: "15:00", reason: "", status: "pendiente" },
      { id: "a4", petId: "p1", ownerId: "u4", vetId: "u2", serviceId: "s1", date: addDays(t, -20), time: "09:30", reason: "Control anual", status: "atendido" },
      { id: "a5", petId: "p3", ownerId: "u5", vetId: "u3", serviceId: "s4", date: addDays(t, -7), time: "16:00", reason: "Control de castración", status: "atendido" },
    ],

    records: [
      { id: "r1", petId: "p1", vetId: "u2", appointmentId: "a4", date: addDays(t, -20), diagnosis: "Buen estado general. Leve sarro dental.", treatment: "Limpieza dental recomendada. Dieta sin cambios.", nextControl: addDays(t, 40) },
      { id: "r2", petId: "p3", vetId: "u3", appointmentId: "a5", date: addDays(t, -7), diagnosis: "Cicatrización correcta.", treatment: "Retirar collar isabelino. Paseos cortos por una semana.", nextControl: "" },
    ],
  };
}