import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Users,
  Home,
  BookOpen,
  HelpCircle,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import './admin.css';

interface UserProfileProps {
  user: string;
  onLogout: () => void;
}

const AdminUserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => (
  <div className="admin-user-profile">
    <div className="admin-avatar">{user.charAt(0).toUpperCase()}</div>
    <span className="admin-user-name">{user}</span>
    <button
      type="button"
      className="admin-btn-logout"
      onClick={onLogout}
      title="Cerrar sesión"
      aria-label="Cerrar sesión"
    >
      <LogOut size={18} />
    </button>
  </div>
);

const navItems = [
  { to: '/admin/users',         icon: <Users size={17} />,      label: 'Usuarios'      },
  { to: '/admin/content',       icon: <BookOpen size={17} />,   label: 'Biblioteca'    },
  { to: '/admin/cuestionarios', icon: <HelpCircle size={17} />, label: 'Cuestionarios' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          'https://backend-web-ciberseguridad.onrender.com/usuario/me/',
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.usuario.nombre);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    await fetch(
      'https://backend-web-ciberseguridad.onrender.com/usuario/logout/',
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    setUser(null);
    closeSidebar();
    navigate('/login');
  };

  return (
    <div className="admin-layout">

      {/* HEADER MOBILE */}
      <header className="admin-mobile-header">
        <div className="admin-mobile-header__left">
          <button
            type="button"
            className="admin-hamburger"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Link to="/home" className="admin-logo admin-logo--inline">
            <span className="material-symbols-outlined">security</span>
            <span className="admin-logo__text">CyberGuard</span>
          </Link>
        </div>

        <div className="admin-mobile-header__right">
          {user && <AdminUserProfile user={user} onLogout={handleLogout} />}
        </div>
      </header>

      {/* HEADER DESKTOP (NUEVO) */}
      <header className="admin-desktop-header">
        <div className="admin-desktop-header__right">
          {user && <AdminUserProfile user={user} onLogout={handleLogout} />}
        </div>
      </header>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <button
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__head">
          <button
            className="admin-sidebar__close"
            onClick={closeSidebar}
          >
            <X size={22} />
          </button>

          <Link to="/home" className="admin-logo admin-logo--drawer">
            <span className="material-symbols-outlined">security</span>
            <span className="admin-logo__text">CyberGuard</span>
          </Link>

          <div className="admin-sidebar__title">
            <div className="admin-sidebar__title-texts">
              <span className="admin-sidebar__title-label">Panel</span>
              <span className="admin-sidebar__title-main">Administración</span>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <Link to="/home" className="admin-nav__item" onClick={closeSidebar}>
            <span className="admin-nav__icon icon-wrap"><Home size={17} /></span>
            <span className="admin-nav__label">Inicio</span>
          </Link>

          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `admin-nav__item ${isActive ? 'admin-nav__item--active' : ''}`
              }
            >
              <span className="admin-nav__icon icon-wrap">{icon}</span>
              <span className="admin-nav__label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
}