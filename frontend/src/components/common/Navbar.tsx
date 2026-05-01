import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
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
  const location = useLocation();
  const [user, setUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Determinamos si el usuario está en el Home (raíz o /home)
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://backend-web-ciberseguridad.onrender.com/usuario/me/", {
          method: "GET",
          credentials: "include", 
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.usuario.nombre);
          setIsAdmin(data.usuario.es_administrador);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch {
        setUser(null);
        setIsAdmin(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("https://backend-web-ciberseguridad.onrender.com/usuario/logout/", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* El botón hamburguesa solo se renderiza si es el Home */}
      {onMenuToggle && isHomePage && (
        <button
          className={styles.hamburger}
          onClick={onMenuToggle}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* El logo tendrá un margen diferente si no hay hamburguesa */}
      <Link 
        to="/" 
        className={`${styles.logo} ${!isHomePage ? styles.logoNoMenu : ""}`}
      >
        <span className="material-symbols-outlined">security</span>
        CyberGuard
      </Link>

      <div className={styles.links}>
        <NavLink to="/home" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
          Inicio
        </NavLink>
        <NavLink to="/amenazas" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
          Amenazas
        </NavLink>
        <NavLink to="/herramientas" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
          Herramientas
        </NavLink>
        <NavLink to="/biblioteca" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
          Biblioteca
        </NavLink>
        <NavLink to="/foro" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
          Foro
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? `${styles.activeLink} ${styles.adminLink}` : styles.adminLink)}
          >
            <ShieldCheck size={16} style={{ marginRight: '4px' }} />
            Admin
          </NavLink>
        )}

        {user ? (
          <UserProfile user={user} onLogout={handleLogout} />
        ) : (
          <Link to="/login" className={styles.btnLogin}>
            Ingresar
          </Link>
        )}
      </div>

      <div className={styles.mobileActions}>
        {isAdmin && (
           <Link to="/admin/users" className={styles.adminIconMobile}>
             <ShieldCheck size={22} color="#3b82f6" />
           </Link>
        )}
        
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