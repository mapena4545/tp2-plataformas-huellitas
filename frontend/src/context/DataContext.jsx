import { createContext, useContext, useEffect, useState } from "react";
import { createSeed } from "../data/seed.js";

const STORAGE_KEY = "huellitas-db";
const DataContext = createContext();

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const loadDb = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
  }
  return createSeed();
};

export function DataProvider({ children }) {
  const [db, setDb] = useState(loadDb);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }, [db]);

  const add = (collection, item) => {
    const created = { ...item, id: newId() };
    setDb((d) => ({ ...d, [collection]: [...d[collection], created] }));
    return created;
  };

  const update = (collection, id, changes) =>
    setDb((d) => ({
      ...d,
      [collection]: d[collection].map((x) => (x.id === id ? { ...x, ...changes } : x)),
    }));

  const remove = (collection, id) =>
    setDb((d) => ({ ...d, [collection]: d[collection].filter((x) => x.id !== id) }));

  const removePet = (petId) =>
    setDb((d) => ({
      ...d,
      pets: d.pets.filter((p) => p.id !== petId),
      appointments: d.appointments.filter((a) => a.petId !== petId),
      records: d.records.filter((r) => r.petId !== petId),
    }));

  const removeUser = (userId) =>
    setDb((d) => {
      const petIds = d.pets.filter((p) => p.ownerId === userId).map((p) => p.id);
      return {
        ...d,
        users: d.users.filter((u) => u.id !== userId),
        pets: d.pets.filter((p) => p.ownerId !== userId),
        appointments: d.appointments
          .filter((a) => !petIds.includes(a.petId))
          .map((a) => (a.vetId === userId && ["pendiente", "confirmado"].includes(a.status) ? { ...a, status: "cancelado" } : a)),
        records: d.records.filter((r) => !petIds.includes(r.petId)),
      };
    });

  const resetDemo = () => setDb(createSeed());

  const findUser = (id) => db.users.find((u) => u.id === id);
  const findPet = (id) => db.pets.find((p) => p.id === id);
  const findService = (id) => db.services.find((s) => s.id === id);

  return (
    <DataContext.Provider
      value={{ ...db, add, update, remove, removePet, removeUser, resetDemo, findUser, findPet, findService }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);