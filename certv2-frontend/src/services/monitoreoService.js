import api from "./api";

/* ╔══════════════════════════════════════╗
   ║  MONITOREOS (cabeceras / organizaciones)
   ╚══════════════════════════════════════╝ */

// Function to list all monitorings based on user role (admin or analista)
export const listMonitoreos = async () => {
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");  // Get the token for authentication

  if (!token) {
    throw new Error("Token is missing");
  }

  try {
    if (rol === "admin") {
      const res = await api.get("/monitoreos/todos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } else {
      // If the role is analista, get only the user's monitorings
      const res = await api.get("/monitoreos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  } catch (error) {
    console.error("Error fetching monitorings:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};

// Function to create a new monitoreo
export const createMonitoreo = (payload) => api.post("/monitoreos", payload);

// Function to update an existing monitoreo
export const updateMonitoreo = (id, payload) => api.put(`/monitoreos/${id}`, payload);

// Function to delete a monitoreo
export const deleteMonitoreo = (id) => api.delete(`/monitoreos/${id}`);

// Function to toggle the active state of a monitoreo (turn it on or off)
export const toggleMonitoreo = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token is missing");
  }

  try {
    const res = await api.patch(`/monitoreos/${id}/toggle`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error("Error toggling monitoreo:", error);
    throw error;
  }
};

// Function to get a single monitoreo by ID
export const getMonitoreo = (id) =>
  api.get(`/monitoreos/${id}`).then(r => r.data);

/* ╔══════════════════════════════════════╗
   ║  DETALLES (dominio + palabra_clave) 
   ╚══════════════════════════════════════╝ */

// Function to create a new "detalle" (details for a monitoreo)
export const createDetalle = (payload) =>
  api.post("/detalles", payload).then(r => r.data);

// Function to update an existing "detalle"
export const updateDetalle = (id, payload) =>
  api.put(`/detalles/${id}`, payload).then(r => r.data);

/* ╔══════════════════════════════════════╗
   ║  VISTA TABLA (admin ≠ analista)
   ╚══════════════════════════════════════╝ */

// Function to list all domains based on user role
export const listDominios = async () => {
  const rol = localStorage.getItem("rol");

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token is missing");
  }

  try {
    if (rol === "admin") {
      const { data } = await api.get("/monitoreos/dominios/todos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    }

    // For analistas, get only their own monitorings and details
    const mis = await listMonitoreos();
    const lists = await Promise.all(
      mis.map((m) =>
        api.get(`/monitoreos/${m.id}/detalles`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then((r) => r.data)
      )
    );
    return lists.flat();
  } catch (error) {
    console.error("Error fetching domains:", error);
    throw error;
  }
};
