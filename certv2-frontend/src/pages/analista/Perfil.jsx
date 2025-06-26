// src/pages/analista/Perfil.jsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getMyProfile } from '../../services/authService';
import { updateConfig } from '../../services/configService';
import Swal from 'sweetalert2';
import {
  FaEnvelope,
  FaUser,
  FaShieldAlt,
  FaCheckCircle,
  FaTelegram,
  FaBell,
  FaCog,
} from 'react-icons/fa';
import '../../styles/profile.css';

const Perfil = () => {
  const [user, setUser] = useState(null);

  const loadProfile = () => {
    getMyProfile()
      .then(data => setUser(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleEditConfig = async () => {
    const { value: form } = await Swal.fire({
      title: 'Actualizar configuración',
      html: `
        <label for="swal-correo" class="swal2-label">Correo de alerta</label>
        <input
          id="swal-correo"
          class="swal2-input"
          placeholder="tu@correo.com"
          value="${user.correo_alerta || ''}"
        />
        <label for="swal-token" class="swal2-label">Token de Telegram</label>
        <input
          id="swal-token"
          class="swal2-input"
          placeholder="123456:ABCdefGhiJKLmnoPQRstuVWxyz"
          value="${user.telegram_token || ''}"
        />
        <label for="swal-chat" class="swal2-label">Chat ID de Telegram</label>
        <input
          id="swal-chat"
          class="swal2-input"
          placeholder="987654321"
          value="${user.telegram_chat_id || ''}"
        />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      background: '#0e1b2c',
      color: '#fff',
      preConfirm: () => ({
        correo_alerta: document.getElementById('swal-correo').value.trim() || null,
        telegram_token: document.getElementById('swal-token').value.trim() || null,
        telegram_chat_id: document.getElementById('swal-chat').value.trim() || null,
      }),
    });

    if (!form) return;

    try {
      await updateConfig(form);
      Swal.fire('Listo', 'Configuración actualizada.', 'success');
      loadProfile();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || 'No pude actualizar configuración', 'error');
    }
  };

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
            <button
              className="config-btn"
              title="Editar configuración"
              onClick={handleEditConfig}
            >
              <FaCog />
            </button>
          </div>

          <div className="profile-body">
            <div className="info-row">
              <FaEnvelope className="icon" /> <span>{user.email}</span>
            </div>
            <div className="info-row">
              <FaCheckCircle className="icon" /> <span>Activo: {user.activo ? 'Sí' : 'No'}</span>
            </div>
            <div className="info-row">
              <FaTelegram className="icon" /> <span>Token: {user.telegram_token || '-'}</span>
            </div>
            <div className="info-row">
              <FaTelegram className="icon" /> <span>Chat ID: {user.telegram_chat_id || '-'}</span>
            </div>
            <div className="info-row">
              <FaBell className="icon" /> <span>Correo alerta: {user.correo_alerta || '-'}</span>
            </div>
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
