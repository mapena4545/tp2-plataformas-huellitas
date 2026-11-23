import { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext.jsx";
import { PageHeader, EmptyState } from "../../components/ui.jsx";
import { SPECIES, ageFrom } from "../../utils/helpers.js";

export default function Patients() {
  const { pets, records, findUser } = useData();
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");

  const q = search.trim().toLowerCase();
  const list = pets.filter(
    (p) =>
      (!species || p.species === species) &&
      (p.name.toLowerCase().includes(q) || (findUser(p.ownerId)?.name ?? "").toLowerCase().includes(q))
  );

  return (
    <>
      <PageHeader title="Pacientes" subtitle={`${pets.length} mascotas registradas`} />

      <div className="toolbar">
        <input placeholder="Buscar por mascota o dueño/a…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={species} onChange={(e) => setSpecies(e.target.value)}>
          <option value="">Todas las especies</option>
          {Object.entries(SPECIES).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
        </select>
      </div>

      {list.length ? (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr><th>Mascota</th><th>Especie / raza</th><th>Edad</th><th>Dueño/a</th><th>Visitas</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{SPECIES[p.species].label}{p.breed && ` - ${p.breed}`}</td>
                  <td>{ageFrom(p.birthYear)}</td>
                  <td>{findUser(p.ownerId)?.name ?? "—"}</td>
                  <td>{records.filter((r) => r.petId === p.id).length}</td>
                  <td><Link to={`/pacientes/${p.id}`} className="btn btn-soft">Historia</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState text="No hay pacientes que coincidan con la búsqueda." />
      )}
    </>
  );
}
