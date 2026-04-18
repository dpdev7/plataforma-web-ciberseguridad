// Layout principal del panel de administración.
// Contiene el sidebar de navegación y el área de contenido.
// Todas las páginas del admin se renderizan dentro del <Outlet />.

import { Outlet, NavLink, Link } from 'react-router-dom';
import { Users, Home, BookOpen, HelpCircle } from 'lucide-react';
import './admin.css';

// Lista de módulos del panel admin.
// Para agregar un nuevo módulo (Biblioteca, Foro, etc.), añade un nuevo objeto aquí con su ruta, ícono y label.
const navItems = [
  { to: '/admin/users',         icon: <Users      size={17} />, label: 'Usuarios'      },
  { to: '/admin/content',       icon: <BookOpen   size={17} />, label: 'Biblioteca'    },
  { to: '/admin/cuestionarios', icon: <HelpCircle size={17} />, label: 'Cuestionarios' },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">

        {/* Logo — redirige al home del sitio principal */}
        <Link to="/home" className="admin-logo">
          <span className="material-symbols-outlined">security</span>
          CyberGuard
        </Link>

        <nav className="admin-nav">

          {/* Botón fijo de regreso al sitio principal */}
          <Link to="/home" className="admin-nav__item">
            <span className="admin-nav__icon icon-wrap"><Home size={17} /></span>
            <span>Inicio</span>
          </Link>

          {/* Módulos del panel — se generan dinámicamente desde navItems.
              NavLink aplica la clase admin-nav__item--active
              automáticamente cuando la ruta coincide. */}
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `admin-nav__item ${isActive ? 'admin-nav__item--active' : ''}`
              }
            >
              <span className="admin-nav__icon icon-wrap">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

      </aside>

      {/* Área de contenido — aquí se renderizan las páginas del admin */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}