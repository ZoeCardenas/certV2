import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 🔒 Validar sesión previa o limpiar basura
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (token && rol && ["admin", "analista", "invitado"].includes(rol)) {
      switch (rol) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "analista":
          navigate("/analista/dashboard");
          break;
        case "invitado":
          navigate("/invitado/dashboard");
          break;
        default:
          localStorage.clear();
      }
    } else {
      localStorage.clear();
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      alert("Credenciales incorrectas");
      return;
    }

    const data = await response.json();
    console.log("Datos recibidos:", JSON.stringify(data, null, 2));

    // ⚠️ Validar que tenga estructura esperada
    if (!data.usuario || !data.usuario.nombre) {
      alert("Respuesta inválida del servidor.");
      console.error("Estructura inesperada:", data);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.usuario.nombre.toLowerCase());

    switch (data.usuario.nombre.toLowerCase()) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "soporte":
        navigate("/analista/dashboard");
        break;
      case "invitado":
        navigate("/invitado/dashboard");
        break;
      default:
        navigate("/unauthorized");
    }

  } catch (error) {
    console.error("Error al iniciar sesión", error);
    alert("Error de conexión");
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
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button className="login-button" onClick={handleLogin}>Iniciar Sesión</button>

        <div className="links">
          <a href="#">¿Olvidaste tu contraseña?</a>
          <a href="#">Crear cuenta</a>
        </div>

        <img src="/logo-capa8.png" alt="capa8" className="logo" />
      </div>
    </div>
  );
};

export default Login;
