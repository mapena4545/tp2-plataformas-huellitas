import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { PageHeader, EmptyState } from "../../components/ui.jsx";
import Modal from "../../components/Modal.jsx";
import UserForm from "../../components/forms/UserForm.jsx";
import { ROLES } from "../../utils/helpers.js";

export default function Users() {
  const { user: me } = useAuth();
  const { users, pets, add, update, removeUser } = useData();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const q = search.trim().toLowerCase();
  const list = users.filter(
    (u) => (!role || u.role === role) && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  );

  const handleSave = (data) => {
    if (editing.id) update("users", editing.id, data);
    else add("users", data);
    setEditing(null);
  };

  const handleDelete = (u) => {
    if (confirm(`¿Eliminar a ${u.name}? Si es cliente, se borran también sus mascotas y turnos.`)) removeUser(u.id);
  };

  return (
    <>
      <PageHeader
        title="Usuarios"
        subtitle="Alta, baja y modificación de cuentas y roles."
        action={<button className="btn btn-primary" onClick={() => setEditing({})}>+ Nuevo usuario</button>}
      />

      <div className="toolbar">
        <input placeholder="Buscar por nombre o email…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Todos los roles</option>
          {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {list.length ? (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Mascotas</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong>{u.id === me.id && <span className="muted small"> (vos)</span>}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge role-${u.role}`}>{ROLES[u.role]}</span></td>
                  <td>{u.role === "cliente" ? pets.filter((p) => p.ownerId === u.id).length : "—"}</td>
                  <td>
                    <button
                      className={`badge ${u.active ? "badge-ok" : "badge-muted"} as-button`}
                      disabled={u.id === me.id}
                      title="Activar / desactivar"
                      onClick={() => update("users", u.id, { active: !u.active })}
                    >
                      {u.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="row-actions">
                    <button className="btn btn-ghost" onClick={() => setEditing(u)}>Editar</button>
                    <button className="btn btn-danger-ghost" disabled={u.id === me.id} onClick={() => handleDelete(u)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState text="No hay usuarios que coincidan." />
      )}

      {editing && (
        <Modal title={editing.id ? "Editar usuario" : "Nuevo usuario"} onClose={() => setEditing(null)}>
          <UserForm initial={editing.id ? editing : null} onSubmit={handleSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </>
  );
}
