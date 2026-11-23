import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import MyPets from "./pages/client/MyPets.jsx";
import MyAppointments from "./pages/client/MyAppointments.jsx";
import Agenda from "./pages/vet/Agenda.jsx";
import Patients from "./pages/vet/Patients.jsx";
import Users from "./pages/admin/Users.jsx";
import Services from "./pages/admin/Services.jsx";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route path="/panel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/mascotas" element={<ProtectedRoute roles={["cliente"]}><MyPets /></ProtectedRoute>} />
          <Route path="/turnos" element={<ProtectedRoute roles={["cliente"]}><MyAppointments /></ProtectedRoute>} />

          <Route path="/agenda" element={<ProtectedRoute roles={["veterinario"]}><Agenda /></ProtectedRoute>} />
          <Route path="/pacientes" element={<ProtectedRoute roles={["veterinario", "admin"]}><Patients /></ProtectedRoute>} />

          <Route path="/usuarios" element={<ProtectedRoute roles={["admin"]}><Users /></ProtectedRoute>} />
          <Route path="/servicios" element={<ProtectedRoute roles={["admin"]}><Services /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
