import { Outlet, NavLink, Link } from 'react-router-dom';
import { Users, Home, BookOpen, HelpCircle } from 'lucide-react';
import './admin.css';

const navItems = [
  { to: '/admin/users',         icon: <Users       size={17} />, label: 'Usuarios'      },
  { to: '/admin/content',       icon: <BookOpen    size={17} />, label: 'Biblioteca'    },
  { to: '/admin/cuestionarios', icon: <HelpCircle  size={17} />, label: 'Cuestionarios' },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/home" className="admin-logo">
          <span className="material-symbols-outlined">security</span>
          CyberGuard
        </Link>
        <nav className="admin-nav">
          <Link to="/home" className="admin-nav__item">
            <span className="admin-nav__icon icon-wrap"><Home size={17} /></span>
            <span>Inicio</span>
          </Link>
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
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}