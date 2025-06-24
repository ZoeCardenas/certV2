import React from "react";
import {
  FaInfoCircle,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import CountryFlag from "react-country-flag";

const Badge = ({ text, color = "#4de0ff" }) => (
  <span className="badge" style={{ background: "#013f4a", color }}>
    {text}
  </span>
);

const MonitorTable = ({
  data = [],
  onDetail,
  onToggle,
  onEdit,
  onDelete,
}) => (
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
          <th>Estado</th>
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

            <td>
              <Badge
                text={row.activo ? "Activo" : "Inactivo"}
                color={row.activo ? "#28d17a" : "#d9534f"}
              />
            </td>

            {/* Acciones: Activar/Desactivar */}
            <td className="actions">
              {row.activo ? (
                <FaToggleOn
                  title="Desactivar"
                  onClick={() => onToggle && onToggle(row)} // Llamamos a la función onToggle al hacer clic
                />
              ) : (
                <FaToggleOff
                  title="Activar"
                  onClick={() => onToggle && onToggle(row)} // Llamamos a la función onToggle al hacer clic
                />
              )}

              <FaEdit
                title="Editar"
                style={{ marginLeft: 6 }}
                onClick={() => onEdit && onEdit(row)}
              />
              <FaTrash
                title="Eliminar"
                style={{ marginLeft: 6 }}
                onClick={() => onDelete && onDelete(row)}
              />
              <FaInfoCircle
                title="Detalles"
                style={{ marginLeft: 6 }}
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
