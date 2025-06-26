// src/pages/analista/Perfil.jsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getMyProfile } from '../../services/authService';
import {
  FaEnvelope,
  FaUser,
  FaShieldAlt,
  FaCheckCircle,
  FaTelegram,
  FaBell
} from 'react-icons/fa';
import '../../styles/profile.css';

const Perfil = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMyProfile()
      .then(data => setUser(data))
      .catch(console.error);
  }, []);

  if (!user) {
    return <div className="profile-loading">Cargando perfil…</div>;
  }

  return (
    <DashboardLayout>
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar"><FaUser size={48} /></div>
            <h2>{user.nombre}</h2>
            <span className="role-badge"><FaShieldAlt /> {user.rol.toUpperCase()}</span>
          </div>

          <div className="profile-body">
            <div className="info-row"><FaEnvelope className="icon" /> <span>{user.email}</span></div>
            <div className="info-row"><FaCheckCircle className="icon" /> <span>Activo: {user.activo ? 'Sí' : 'No'}</span></div>
            <div className="info-row"><FaTelegram className="icon" /> <span>Token: {user.telegram_token || '-'}</span></div>
            <div className="info-row"><FaTelegram className="icon" /> <span>Chat ID: {user.telegram_chat_id || '-'}</span></div>
            <div className="info-row"><FaBell className="icon" /> <span>Correo alerta: {user.correo_alerta || '-'}</span></div>
            <div className="info-row dates">
              <div>
                <small>Creado:</small>
                <p>{new Date(user.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <small>Actualizado:</small>
                <p>{new Date(user.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Perfil;
