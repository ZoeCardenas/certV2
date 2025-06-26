// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "../../styles/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/capa8-logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const { token, rol, nombre } = await loginUser(email, password);
      if (!token || !["admin", "analista"].includes(rol?.toLowerCase())) {
        alert("Rol no permitido");
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol.toLowerCase());
      localStorage.setItem("nombre", nombre);
      navigate(`/${rol.toLowerCase()}/inicio`, { replace: true });
    } catch (error) {
      console.error("Axios error ›", error);
      alert(
        error.response?.status === 401
          ? "Credenciales incorrectas"
          : "Error de conexión"
      );
    }
  };

  // …resto del código…

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Capa8 Logo" className="login-logo" />
        <h2>CertWatcher</h2>
        <p>Inteligencia en tiempo real</p>

        {/* Contenedor para el email, idéntico al de contraseña */}
        <div className="password-container">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="password-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Contenedor para la contraseña */}
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="eye-button"
            onClick={togglePasswordVisibility}
            aria-label="Mostrar u ocultar contraseña"
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
      </div>
    </div>
  );

};

export default Login;
