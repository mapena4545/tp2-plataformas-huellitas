import { createContext, useContext, useState } from "react";
import { useData } from "./DataContext.jsx";

const SESSION_KEY = "huellitas-session";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { users, add } = useData();
  const [userId, setUserId] = useState(() => localStorage.getItem(SESSION_KEY));

  const user = users.find((u) => u.id === userId && u.active) || null;

  const startSession = (id) => {
    setUserId(id);
    localStorage.setItem(SESSION_KEY, id);
  };

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: "Email o contraseña incorrectos." };
    if (!found.active) return { ok: false, error: "Tu cuenta está deshabilitada. Comunicate con la veterinaria." };
    startSession(found.id);
    return { ok: true };
  };

  const register = ({ name, email, phone, password }) => {
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: "Ya existe una cuenta con ese email." };
    }
    const created = add("users", { name, email: email.trim(), phone, password, role: "cliente", active: true });
    startSession(created.id);
    return { ok: true };
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);