// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import '../../styles/register.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);        // ← mensaje de feedback
  const [messageType, setMessageType] = useState('');  // 'error' o 'success'
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleRegister = async () => {
    setMessage(null);
    try {
      const { token, rol } = await registerUser({ nombre, email, password });
      if (!token) throw new Error('No se recibió token de autenticación.');

      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol.toLowerCase());

      setMessageType('success');
      setMessage('¡Registro exitoso! Redirigiendo...');
      
      // Tras breve espera, redirigimos
      setTimeout(() => {
        navigate(`/${rol.toLowerCase()}/dashboard`, { replace: true });
      }, 1500);

    } catch (err) {
      console.error('Error al registrar:', err);
      setMessageType('error');
      setMessage(
        err.response?.data?.error ||
        'Ocurrió un problema al registrarte. Por favor intenta de nuevo.'
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Crear Cuenta</h2>

        {message && (
          <div className={`form-message ${messageType}`}>
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Nombre completo"
          className="input"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          className="input"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            className="input"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="eye-button"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button className="register-button" onClick={handleRegister}>
          Registrarme
        </button>

        <div className="links">
          <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
