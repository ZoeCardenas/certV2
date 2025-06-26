// src/pages/analista/InicioAnalista.jsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  listDominios,
  listAlertas,
  countAlertas
} from '../../services/monitoreoService';
import { FaFileAlt, FaBell, FaServer } from 'react-icons/fa';
import StatCard from '../../components/StatCard';
import AlertTable from '../../components/AlertTable';
import '../../styles/dashboard.css';

const InicioAnalista = () => {
  const [stats, setStats] = useState({
    certificados: 0,
    alertas: 0,
    dominios: 0
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const [doms, alertArr, alertCountRaw] = await Promise.all([
          listDominios(),
          listAlertas(),
          countAlertas().catch(err => {
            if (err.response?.status === 500) {
              setMensaje('Aún no hay alertas registradas.');
              return 0;
            }
            throw err;
          })
        ]);

        setStats({
          certificados: alertCountRaw,
          alertas: Array.isArray(alertArr) ? alertArr.length : 0,
          dominios: Array.isArray(doms) ? doms.length : 0
        });
      } catch (e) {
        console.error('Error cargando estadísticas:', e);
        setMensaje('Ocurrió un problema cargando las estadísticas.');
      }
    }
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <h2>Inicio</h2>

      {mensaje && (
        <div className="form-message error" style={{ marginBottom: '1rem' }}>
          {mensaje}
        </div>
      )}

      <section className="stats-grid">
        <StatCard icon={FaFileAlt} label="Alertas Detectadas" value={stats.certificados} />
        <StatCard icon={FaBell} label="Alertas totales" value={stats.alertas} />
        <StatCard icon={FaServer} label="Dominios" value={stats.dominios} />
      </section>

      <section style={{ marginTop: '2rem' }}>
        <AlertTable limit={5} />
      </section>
    </DashboardLayout>
  );
};

export default InicioAnalista;
