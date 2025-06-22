import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout() {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: ChartBarIcon },
    { name: "Alertas", path: "/alertas", icon: BellAlertIcon },
    { name: "Configuración", path: "/configuracion", icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex min-h-screen bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6">
        <h1 className="text-2xl font-bold text-primary mb-8">CertV2</h1>
        <nav className="space-y-4">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-800"
                }`
              }
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </NavLink>
          ))}
          <div className="mt-10 border-t border-border pt-4">
            <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-500">
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
