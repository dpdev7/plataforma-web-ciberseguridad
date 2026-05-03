import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"; 
import { Menu, X, LogOut, ShieldCheck, User, Settings, Trash2, ChevronDown} from "lucide-react";
import styles from "./Navbar.module.css";
import { API_BACKEND } from "../../utils/api";

interface NavbarProps {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

interface UserProfileProps {
  user: string;
  onLogout: () => void;
  onOpenProfile: (type: "view" | "edit" | "delete") => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onLogout,
  onOpenProfile
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className={styles.userDropdownWrapper}>
      <div
        className={styles.userProfile}
        onClick={() => setOpenMenu(!openMenu)}
      >
        <div className={styles.avatar}>
          {user.charAt(0).toUpperCase()}
        </div>

        <span className={styles.userName}>{user}</span>

        <ChevronDown size={16} className={styles.dropdownIcon} />
      </div>

      {openMenu && (
        <div className={styles.userDropdown}>
          <button
            onClick={() => {
              onOpenProfile("view");
              setOpenMenu(false);
            }}
            >
            <User size={16} />
            Ver perfil
          </button>

          <button
            onClick={() => {
              onOpenProfile("edit");
              setOpenMenu(false);
              }}
            >
            <Settings size={16} />
            Editar perfil
          </button>

          <button
            onClick={() => {
              onOpenProfile("delete");
              setOpenMenu(false);
          }}
        >
            <Trash2 size={16} />
            Eliminar cuenta
          </button>

          <button onClick={onLogout}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default function Navbar({ onMenuToggle, menuOpen }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para detectar la ruta actual
  const [user, setUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalType, setModalType] = useState<
  "view" | "edit" | "delete" | null
  >(null);

  /**
   * LÓGICA DE VISIBILIDAD:
   * La hamburguesa solo se muestra si:
   * 1. Existe la prop onMenuToggle.
   * 2. La ruta es "/" o "/home".
   */
  const showHamburger = !!onMenuToggle && (location.pathname === "/" || location.pathname === "/home");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BACKEND}/usuario/me/`, {
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
    await fetch(`${API_BACKEND}/usuario/logout/`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setIsAdmin(false);
    navigate("/home");
  };

  return (
    <nav className={styles.navbar}>
      {/* El botón ahora desaparece automáticamente en /biblioteca */}
      {showHamburger && (
        <button
          className={styles.hamburger}
          onClick={onMenuToggle}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      <Link
        to="/"
        className={`${styles.logo} ${!showHamburger ? styles.logoNoMenu : ""}`}
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
            className={({ isActive }) =>
              isActive ? `${styles.activeLink} ${styles.adminLink}` : styles.adminLink
            }
          >
            <ShieldCheck size={16} style={{ marginRight: "4px" }} />
            Admin
          </NavLink>
        )}

        {user ? (
          <UserProfile
            user={user}
            onLogout={handleLogout}
            onOpenProfile={(type) => {
              setModalType(type);
              setShowProfileModal(true);
          }}
          />
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
          <UserProfile
            user={user}
            onLogout={handleLogout}
            onOpenProfile={(type) => {
              setModalType(type);
              setShowProfileModal(true);
            }}
          />
        ) : (
          <Link to="/login" className={styles.btnLogin}>
            Ingresar
          </Link>
        )}
      </div>

      {showProfileModal && (
  <div className={styles.profileModalOverlay}>
    <div className={styles.profileModal}>
      <button
        className={styles.closeModal}
        onClick={() => {
          setShowProfileModal(false);
          setModalType(null);
        }}
      >
        ✕
      </button>

      {/* VER PERFIL */}
      {modalType === "view" && (
        <>
          <h2>Mi perfil</h2>
          <p className={styles.profileSubtitle}>
            Consulta tu información registrada.
          </p>

          <div className={styles.profileCard}>
            <label>Nombre</label>
            <input type="text" value={user || ""} readOnly />

            <label>Correo</label>
            <input
              type="email"
              value="usuario@email.com"
              readOnly
            />
          </div>
        </>
      )}

      {/* EDITAR PERFIL */}
      {modalType === "edit" && (
        <>
          <h2>Editar perfil</h2>
          <p className={styles.profileSubtitle}>
            Actualiza tu información personal.
          </p>

          <div className={styles.profileCard}>
            <label>Nombre</label>
            <input type="text" defaultValue={user || ""} />

            <button className={styles.saveBtn}>
              Guardar cambios
            </button>
          </div>
        </>
      )}

      {/* ELIMINAR */}
      {modalType === "delete" && (
        <div className={styles.deleteSection}>
          <h3>Solicitar eliminación de cuenta</h3>

          <p>
            Revisamos cada solicitud manualmente para evitar
            eliminaciones accidentales o no autorizadas y para entender cómo mejorar la plataforma.
          </p>

          <select>
            <option>Selecciona un motivo</option>
            <option>Ya no uso la plataforma</option>
            <option>Problemas técnicos</option>
            <option>Privacidad</option>
            <option>Otro</option>
          </select>

          <textarea placeholder="Explícanos tu motivo..." />

          <div className={styles.deleteWarning}>
            Esta solicitud será revisada por administradores.
          </div>

          <button className={styles.deleteBtn}>
            Enviar solicitud
          </button>
        </div>
      )}
    </div>
  </div>
)}
    </nav>
  );
}