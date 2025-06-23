import React from "react";
import {
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import CountryFlag from "react-country-flag";

const Badge = ({ text }) => <span className="badge">{text}</span>;

const MonitorTable = ({ data = [], onDetail }) => (
  <div className="monitor-table-wrapper">
    <h2>Monitoreo en Tiempo Real</h2>

    <table className="monitor-table">
      <thead>
        <tr>
          <th>Organización</th>
          <th>Dominio</th>
          <th>Hora de emisión</th>
          <th>Palabra&nbsp;Clave</th>
          <th>Ubicación</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.organizacion}</td>
            <td>{row.dominio}</td>
            <td>{row.hora}</td>
            <td>
              <Badge text={row.coincidencia} />
            </td>
            <td className="flag">
              <CountryFlag svg countryCode={row.country} />
              <span>{row.location}</span>
            </td>
            <td className="actions">
              <FaExclamationTriangle title="Marcar alerta" />
              <FaExternalLinkAlt title="Abrir enlace" style={{ marginLeft: 4 }} />
              <FaInfoCircle
                title="Detalles"
                style={{ marginLeft: 4 }}
                onClick={() => onDetail && onDetail(row)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MonitorTable;
