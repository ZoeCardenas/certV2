import api from "./api";
export const getConfig    = () => api.get("/configuracion").then(r => r.data);
export const updateConfig = (p) => api.put("/configuracion", p);
export const testAlerta   = (p) => api.post("/configuracion/test-alerta", p);
