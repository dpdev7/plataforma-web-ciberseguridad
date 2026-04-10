import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import styles from "./Navbar.module.css";

interface NavbarProps {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

interface UserProfileProps {
  user: string;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => (
  <div className={styles.userProfile}>
    <div className={styles.avatar}>{user.charAt(0).toUpperCase()}</div>
    <span className={styles.userName}>{user}</span>
    <button
      className={styles.btnLogout}
      onClick={onLogout}
      title="Cerrar sesión"
    >
      <LogOut size={18} />
    </button>
  </div>
);

export default function Navbar({ onMenuToggle, menuOpen }: NavbarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);

  // 🔥 NUEVO: verificar sesión con backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/usuario/me/", {
          method: "GET",
          credentials: "include", // 🔥 envía cookie HttpOnly
        });

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

  const handleLogout = async () => {
    await fetch("http://localhost:8000/usuario/logout/", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {onMenuToggle && (
        <button
          className={styles.hamburger}
          onClick={onMenuToggle}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      <Link to="/" className={styles.logo}>
        <span className="material-symbols-outlined">security</span>
        CyberGuard
      </Link>

      <div className={styles.links}>
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/amenazas"
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
        >
          Amenazas
        </NavLink>
        <NavLink
          to="/herramientas"
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
        >
          Herramientas
        </NavLink>
        <NavLink
          to="/biblioteca"
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
        >
          Biblioteca
        </NavLink>
        <NavLink
          to="/foro"
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
        >
          Foro
        </NavLink>

        {user ? (
          <UserProfile user={user} onLogout={handleLogout} />
        ) : (
          <Link to="/login" className={styles.btnLogin}>
            Ingresar
          </Link>
        )}
      </div>

      <div className={styles.mobileActions}>
        {user ? (
          <UserProfile user={user} onLogout={handleLogout} />
        ) : (
          <Link to="/login" className={styles.btnLogin}>
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  );
}
