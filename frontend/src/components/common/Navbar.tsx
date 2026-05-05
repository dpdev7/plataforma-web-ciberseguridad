import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ShieldCheck, User, Settings, Trash2, ChevronDown } from "lucide-react";
import styles from "./Navbar.module.css";
import { apiFetch, setAuthToken } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

interface UserProfileProps {
  user: string;
  onLogout: () => void;
  onOpenProfile: (type: "view" | "edit" | "delete") => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onOpenProfile }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.userDropdownWrapper} ref={dropdownRef}>
      <div className={styles.userProfile} onClick={() => setOpenMenu(!openMenu)}>
        <div className={styles.avatar}>{user.charAt(0).toUpperCase()}</div>
        <span className={styles.userName}>{user}</span>
        <ChevronDown size={16} className={styles.dropdownIcon} />
      </div>

      {openMenu && (
        <div className={styles.userDropdown}>
          <button onClick={() => { onOpenProfile("view"); setOpenMenu(false); }}>
            <User size={16} /> Ver perfil
          </button>
          <button onClick={() => { onOpenProfile("edit"); setOpenMenu(false); }}>
            <Settings size={16} /> Editar perfil
          </button>
          <button onClick={() => { onOpenProfile("delete"); setOpenMenu(false); }}>
            <Trash2 size={16} /> Eliminar cuenta
          </button>
          <button onClick={onLogout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

function DeleteForm({ usuario, onClose, styles }: {
  usuario: any;
  onClose: () => void;
  styles: any;
}) {
  const [motivo,      setMotivo]      = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enviando,    setEnviando]    = useState(false);

  const MAX_DESC = 300;

  const handleEnviar = async () => {
    if (!motivo || !usuario) {
      alert('Por favor selecciona un motivo');
      return;
    }
    setEnviando(true);
    try {
      const data = await apiFetch('/solicitud/crear/', {
        method: 'POST',
        body: JSON.stringify({
          usuario_id:  usuario.id,
          motivo,
          descripcion: descripcion || '',
        }),
      });
      if (data.success) {
        alert('Solicitud enviada. Te notificaremos por correo.');
        onClose();
      } else {
        alert(data.message || 'Error al enviar la solicitud');
      }
    } catch {
      alert('Error de conexión');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.deleteSection}>
      <h3>Solicitar eliminación de cuenta</h3>
      <p>Revisamos cada solicitud manualmente para evitar eliminaciones accidentales.</p>

      <select
        value={motivo}
        onChange={e => setMotivo(e.target.value)}
        disabled={enviando}
      >
        <option value="">Selecciona un motivo</option>
        <option value="no_uso">Ya no uso la plataforma</option>
        <option value="problemas_tec">Problemas técnicos</option>
        <option value="privacidad">Privacidad</option>
        <option value="otro">Otro</option>
      </select>

      <div style={{ position: 'relative', marginTop: '12px' }}>
        <textarea
          className={styles.deleteTextarea}
          placeholder="Explícanos tu motivo..."
          value={descripcion}
          onChange={e => setDescripcion(e.target.value.slice(0, MAX_DESC))}
          disabled={enviando}
        />
        <span style={{
          position: 'absolute',
          bottom: '8px',
          right: '10px',
          fontSize: '11px',
          color: descripcion.length >= MAX_DESC ? '#e74444' : '#94a3b8',
        }}>
          {descripcion.length}/{MAX_DESC}
        </span>
      </div>

      <div className={styles.deleteWarning}>
        Esta solicitud será revisada por administradores.
      </div>

      <button
        className={styles.deleteBtn}
        onClick={handleEnviar}
        disabled={enviando}
        style={{ opacity: enviando ? 0.7 : 1, cursor: enviando ? 'not-allowed' : 'pointer' }}
      >
        {enviando ? 'Enviando solicitud...' : 'Enviar solicitud'}
      </button>
    </div>
  );
}

export default function Navbar({ onMenuToggle, menuOpen }: NavbarProps) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { usuario, logout: authLogout } = useAuth();

  const [user,             setUser]             = useState<string | null>(null);
  const [isAdmin,          setIsAdmin]          = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalType,        setModalType]        = useState<"view" | "edit" | "delete" | null>(null);

  const showHamburger = !!onMenuToggle && (location.pathname === "/" || location.pathname === "/home");

  // Si hay usuario en el contexto, úsalo directamente
  useEffect(() => {
    if (usuario) {
      setUser(usuario.nombre);
      setIsAdmin(usuario.es_administrador);
      return;
    }

    // Si no hay contexto (recarga de página), intenta obtenerlo del backend
    const fetchUser = async () => {
      try {
        const data = await apiFetch('/usuario/me/');
        if (data.authenticated) {
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
  }, [usuario, location.pathname]);

  const handleLogout = async () => {
    await apiFetch('/usuario/logout/', { method: "POST" });
    authLogout();          // limpia el contexto
    setAuthToken(null);    // limpia el token en apiFetch
    setUser(null);
    setIsAdmin(false);
    navigate("/home");
  };

  return (
    <nav className={styles.navbar}>
      {showHamburger && (
        <button className={styles.hamburger} onClick={onMenuToggle} aria-label="Abrir menú">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      <Link to="/" className={`${styles.logo} ${!showHamburger ? styles.logoNoMenu : ""}`}>
        <span className="material-symbols-outlined">security</span>
        CyberGuard
      </Link>

      <div className={styles.links}>
        <NavLink to="/home" className={({ isActive }) => isActive ? styles.activeLink : ""}>Inicio</NavLink>
        <NavLink to="/amenazas" className={({ isActive }) => isActive ? styles.activeLink : ""}>Amenazas</NavLink>
        <NavLink to="/herramientas" className={({ isActive }) => isActive ? styles.activeLink : ""}>Herramientas</NavLink>
        <NavLink to="/biblioteca" className={({ isActive }) => isActive ? styles.activeLink : ""}>Biblioteca</NavLink>
        <NavLink to="/foro" className={({ isActive }) => isActive ? styles.activeLink : ""}>Foro</NavLink>

        {isAdmin && (
          <NavLink to="/admin/users"
            className={({ isActive }) => isActive ? `${styles.activeLink} ${styles.adminLink}` : styles.adminLink}>
            <ShieldCheck size={16} style={{ marginRight: "4px" }} />
            Admin
          </NavLink>
        )}

        {user ? (
          <UserProfile user={user} onLogout={handleLogout}
            onOpenProfile={(type) => { setModalType(type); setShowProfileModal(true); }} />
        ) : (
          <Link to="/login" className={styles.btnLogin}>Ingresar</Link>
        )}
      </div>

      <div className={styles.mobileActions}>
        {isAdmin && (
          <Link to="/admin/users" className={styles.adminIconMobile}>
            <ShieldCheck size={22} color="#3b82f6" />
          </Link>
        )}
        {user ? (
          <UserProfile user={user} onLogout={handleLogout}
            onOpenProfile={(type) => { setModalType(type); setShowProfileModal(true); }} />
        ) : (
          <Link to="/login" className={styles.btnLogin}>Ingresar</Link>
        )}
      </div>

      {showProfileModal && (
        <div className={styles.profileModalOverlay}>
          <div className={styles.profileModal}>
            <button className={styles.closeModal} onClick={() => { setShowProfileModal(false); setModalType(null); }}>✕</button>

            {modalType === "view" && (
              <>
                <h2>Mi perfil</h2>
                <p className={styles.profileSubtitle}>Consulta tu información registrada.</p>
                <div className={styles.profileCard}>
                  <label>Nombre</label>
                  <input type="text" value={user || ""} readOnly />
                  <label>Correo</label>
                  <input type="email" value="usuario@email.com" readOnly />
                </div>
              </>
            )}

{modalType === "edit" && (
  <>
    <h2>Editar perfil</h2>
    <p className={styles.profileSubtitle}>Actualiza tu información personal.</p>
    <div className={styles.profileCard}>
      <label>Nombre</label>
      <input
        type="text"
        id="edit-nombre"
        defaultValue={user || ""}
      />
      <button
        className={styles.saveBtn}
        onClick={async () => {
          const input = document.getElementById('edit-nombre') as HTMLInputElement;
          const nombre = input?.value?.trim();
          if (!nombre || !usuario) return;
          await apiFetch(`/usuario/update/${usuario.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ nombre }),
          });
          setUser(nombre);
          setShowProfileModal(false);
          setModalType(null);
        }}
      >
        Guardar cambios
      </button>
    </div>
  </>
)}

{modalType === "delete" && (
  <DeleteForm
    usuario={usuario}
    onClose={() => { setShowProfileModal(false); setModalType(null); }}
    styles={styles}
  />
)}
          </div>
        </div>
      )}
    </nav>
  );
}