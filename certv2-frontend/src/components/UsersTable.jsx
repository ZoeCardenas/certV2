// src/components/UsersTable.jsx
import React from "react";
import {
  FaInfoCircle,
  FaUserEdit,
  FaUserShield,
  FaTrash,
} from "react-icons/fa";
import "../styles/users-table.css";

const Badge = ({ text, color }) => (
  <span className="ut-badge" style={{ background: color }}>
    {text}
  </span>
);

const UsersTable = ({
  data = [],
  onDetail,
  onEdit,
  onChangeRole,
  onDelete,
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="ut-empty">No hay usuarios para mostrar.</p>;
  }

  return (
    <div className="ut-wrapper">
      <table className="ut-table">
        <thead>
          <tr>
            <th className="ut-th">ID</th>
            <th className="ut-th">Nombre</th>
            <th className="ut-th">Email</th>
            <th className="ut-th">Rol</th>
            <th className="ut-th">Estado</th>            {/* Nueva columna */}
            <th className="ut-th">Creado</th>
            <th className="ut-th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u) => {
            // Asumimos que tu modelo tiene un flag booleano `eliminado` o `deleted`
            const isDeleted = u.eliminado || u.deletedAt; 
            return (
              <tr key={u.id} className="ut-row">
                <td className="ut-td">{u.id}</td>
                <td className="ut-td">{String(u.nombre ?? "-")}</td>
                <td className="ut-td">{String(u.email ?? "-")}</td>
                <td className="ut-td">
                  <Badge
                    text={u.rol ?? "-"}
                    color={u.rol === "admin" ? "#f6c23e" : "#1cc88a"}
                  />
                </td>
                <td className="ut-td">
                  <Badge
                    text={isDeleted ? "Inactivo" : "Activo"}
                    color={isDeleted ? "#e74a3b" : "#28a745"}
                  />
                </td>
                <td className="ut-td">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="ut-td ut-actions">
                  <FaInfoCircle
                    title="Ver Detalle"
                    className="ut-icon"
                    onClick={() => onDetail?.(u)}
                  />
                  <FaUserEdit
                    title="Editar Usuario"
                    className="ut-icon"
                    onClick={() => onEdit?.(u)}
                  />
                  <FaUserShield
                    title="Cambiar Rol"
                    className="ut-icon"
                    onClick={() => onChangeRole?.(u)}
                  />
                  <FaTrash
                    title="Eliminar Usuario"
                    className="ut-icon ut-delete"
                    onClick={() => onDelete?.(u)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
