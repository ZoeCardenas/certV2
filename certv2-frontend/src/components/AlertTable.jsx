import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getAlertas } from '../services/alertaService';
import '../styles/alertTable.css';

const AlertTable = ({ limit = 0 }) => {
  const [alertas, setAlertas] = useState([]);
  const [prevCount, setPrevCount] = useState(0);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAlertas();
        const limitadas = limit > 0 ? data.slice(0, limit) : data;
        setAlertas(limitadas);

        if (data.length > prevCount && prevCount !== 0 && limit === 0) {
          const ultima = data[0];
          const sonido = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alert-bells-echo-765.mp3');
          sonido.play();

          Swal.fire({
            title: '🚨 ¡Encontré algo nuevo!',
            html: `
              <p><b>Organización:</b> ${ultima.Monitoreo?.organizacion || 'Desconocida'}</p>
              <p><b>Dominio:</b> ${ultima.dominio_detectado}</p>
              <p><b>Palabra clave:</b> <span class="badge-keyword">${ultima.palabra_clave_detectada}</span></p>
              <p><b>Hora:</b> ${new Date(ultima.created_at).toLocaleTimeString()}</p>
            `,
            icon: 'info',
            confirmButtonText: 'Ver más',
            background: '#0b1e34',
            color: '#fff',
            customClass: {
              confirmButton: 'alertas-exportar'
            }
          });
        }

        setPrevCount(data.length);
      } catch (error) {
        console.error('Error al cargar alertas:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [prevCount, limit]);

  const exportarCSV = () => {
    const filas = alertas.map(a => [
      a.Monitoreo?.organizacion || 'Desconocido',
      a.dominio_detectado,
      a.palabra_clave_detectada,
      a.enviado_por,
      new Date(a.created_at).toLocaleString()
    ]);

    const csv = [
      ['Organización', 'Dominio', 'Palabra Clave', 'Enviado Por', 'Hora'],
      ...filas
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alertas.csv';
    a.click();
  };

  const verDetalles = (alerta) => {
    Swal.fire({
      title: '📌 Detalles de la Alerta',
      html: `
        <p><b>Organización:</b> ${alerta.Monitoreo?.organizacion || 'Desconocida'}</p>
        <p><b>Dominio:</b> ${alerta.dominio_detectado}</p>
        <p><b>Palabra clave:</b> <span class="badge-keyword">${alerta.palabra_clave_detectada}</span></p>
        <p><b>Enviado por:</b> ${alerta.enviado_por}</p>
        <p><b>Fecha y hora:</b> ${new Date(alerta.created_at).toLocaleString()}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      background: '#121e36',
      color: '#fff'
    });
  };

  const alertasFiltradas = alertas.filter(a =>
    a.dominio_detectado.toLowerCase().includes(filtro.toLowerCase()) ||
    a.palabra_clave_detectada.toLowerCase().includes(filtro.toLowerCase()) ||
    (a.Monitoreo?.organizacion || '').toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="alert-table-container">
      {limit === 0 && (
        <div className="alertas-header">
          <h2 className="alert-table-title">Alertas en Tiempo Real</h2>
          <div className="alertas-controls">
            <input
              type="text"
              className="alertas-input"
              placeholder="Buscar dominio, palabra clave u organización..."
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
            <button className="alertas-exportar" onClick={exportarCSV}>
              📥 Exportar CSV
            </button>
          </div>
        </div>
      )}

      {limit > 0 && <h2 className="alert-table-title">Alertas Recientes</h2>}

      <table className="alert-table">
        <thead>
          <tr>
            <th>Organización</th>
            <th>Dominio</th>
            <th>Palabra Clave</th>
            <th>Enviado Por</th>
            <th>Hora</th>
            {limit === 0 && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {alertasFiltradas.map((alerta) => (
            <tr key={alerta.id}>
              <td>{alerta.Monitoreo?.organizacion || 'Desconocido'}</td>
              <td>{alerta.dominio_detectado}</td>
              <td><span className="badge-keyword">{alerta.palabra_clave_detectada}</span></td>
              <td>{alerta.enviado_por}</td>
              <td>{new Date(alerta.created_at).toLocaleTimeString()}</td>
              {limit === 0 && (
                <td>
                  <button className="btn-detalles" onClick={() => verDetalles(alerta)}>
                    Ver Detalles
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertTable;
