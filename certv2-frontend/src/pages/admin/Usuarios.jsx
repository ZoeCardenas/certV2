// src/pages/admin/Usuarios.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import UsersTable from "../../components/UsersTable";
import Swal from "sweetalert2";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../../services/monitoreoService";
import { showConfirm, showSuccess, showError } from "../../utils/swal";

const Usuarios = () => {
  const [users, setUsers] = useState([]);

  const load = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      showError("Error", "No pude cargar la lista de usuarios.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (u) => {
    const ok = await showConfirm(
      "Eliminar usuario",
      `¿Estás seguro de eliminar a ${u.nombre}?`
    );
    if (!ok) return;
    try {
      await deleteUser(u.id);
      showSuccess("Eliminado", `${u.nombre} ha sido eliminado.`);
      load();
    } catch (err) {
      console.error(err);
      showError("Error", "No pude eliminar el usuario.");
    }
  };

  const handleChangeRole = async (u) => {
    const nuevoRol = u.rol === "admin" ? "analista" : "admin";
    const ok = await showConfirm(
      "Cambiar rol",
      `¿Seguro de cambiar el rol de ${u.nombre} a "${nuevoRol}"?`
    );
    if (!ok) return;
    try {
      await updateUser(u.id, { rol: nuevoRol });
      showSuccess("Listo", `Rol de ${u.nombre} cambiado a ${nuevoRol}.`);
      load();
    } catch (err) {
      console.error(err);
      showError("Error", "No pude actualizar el rol.");
    }
  };

  const handleEdit = async (u) => {
    const { value: form } = await Swal.fire({
      title: "Editar usuario",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${u.nombre}">
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${u.email}">
        <select id="swal-rol" class="swal2-select">
          <option value="admin" ${u.rol === "admin" ? "selected" : ""}>Admin</option>
          <option value="analista" ${u.rol === "analista" ? "selected" : ""}>Analista</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      background: "#0e1b2c",
      color: "#fff",
      preConfirm: () => {
        const nombre = document.getElementById("swal-name").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const rol = document.getElementById("swal-rol").value;
        if (!nombre || !email) {
          Swal.showValidationMessage("El nombre y el email son obligatorios");
          return;
        }
        return { nombre, email, rol };
      },
    });

    if (!form) return;

    try {
      await updateUser(u.id, form);
      showSuccess("Actualizado", "Usuario modificado correctamente.");
      load();
    } catch (err) {
      console.error(err);
      showError("Error", "No pude actualizar el usuario.");
    }
  };

  const handleDetail = (u) => {
    Swal.fire({
      title: "Detalle de usuario",
      html: `
        <p><b>ID:</b> ${u.id}</p>
        <p><b>Nombre:</b> ${u.nombre}</p>
        <p><b>Email:</b> ${u.email}</p>
        <p><b>Rol:</b> ${u.rol}</p>
        <p><b>Creado:</b> ${new Date(u.createdAt).toLocaleString()}</p>
      `,
      confirmButtonText: "Cerrar",
      background: "#0e1b2c",
      color: "#fff",
      confirmButtonColor: "#16a34a",
    });
  };

  return (
    <DashboardLayout>
      <h2>Gestión de Usuarios</h2>
      <UsersTable
        data={users}
        onDetail={handleDetail}
        onEdit={handleEdit}
        onChangeRole={handleChangeRole}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  );
};

export default Usuarios;
