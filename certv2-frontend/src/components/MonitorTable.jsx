import React from "react";
import { FaExternalLinkAlt, FaExclamationTriangle } from "react-icons/fa";
import CountryFlag from "react-country-flag"; // npm i react-country-flag

const Badge = ({ text }) => <span className="badge">{text}</span>;

const MonitorTable = ({ data = [] }) => (
  <div className="monitor-table-wrapper">
    <h2>Monitoreo en Tiempo Real</h2>

    <table className="monitor-table">
      <thead>
        <tr>
          <th>Organización / Dominio</th>
          <th>Hora de emisión</th>
          <th>Palabras Clave</th>
          <th>Ubicación</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.dominio}</td>
            <td>{row.hora}</td>
            <td>
              <Badge text={row.coincidencia} />{" "}
              {row.conteo && <span>{row.conteo}</span>}
            </td>
            <td className="flag">
              <CountryFlag svg countryCode={row.country} />
              <span>{row.location}</span>
            </td>
            <td className="actions">
              <FaExclamationTriangle title="Marcar alerta" />
              <FaExternalLinkAlt title="Abrir detalle" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MonitorTable;
