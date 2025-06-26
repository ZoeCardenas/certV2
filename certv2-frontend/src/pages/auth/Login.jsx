// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "../../styles/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const { token, rol } = await loginUser(email, password);

      if (!token || !["admin", "analista"].includes(rol?.toLowerCase())) {
        alert("Rol no permitido");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol.toLowerCase());

      // Redirección específica por rol
      if (rol.toLowerCase() === "admin") {
        navigate("/admin/inicio", { replace: true });
      } else if (rol.toLowerCase() === "analista") {
        navigate("/analista/inicio", { replace: true });
      }
    } catch (error) {
      console.error("Axios error ›", error);
      alert(
        error.response?.status === 401
          ? "Credenciales incorrectas"
          : "Error de conexión"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>CertWatcher</h2>
        <p>Inteligencia en tiempo real</p>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="eye-button"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Iniciar Sesión
        </button>

        <div className="links">
          <a href="#">¿Olvidaste tu contraseña?</a>
          <a href="/register">Crear cuenta</a>
        </div>

        <img src="/logo-capa8.png" alt="capa8" className="logo" />
      </div>
    </div>
  );
};

export default Login;
