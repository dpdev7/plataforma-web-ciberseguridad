// Barra de navegación global fija.
// Autónoma: sus estilos viven en Navbar.module.css.
// En mobile muestra: botón hamburguesa + logo + botón "Ingresar".
// Props opcionales: solo Home las necesita para el drawer del TOC.

import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

interface Props {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export default function Navbar({ onMenuToggle, menuOpen }: Props) {
  return (
    <nav className={styles.navbar}>

      {/* Mobile: hamburguesa a la izquierda del logo */}
      {onMenuToggle && (
        <button
          className={styles.hamburger}
          onClick={onMenuToggle}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* Logo */}
      <Link to="/" className={styles.logo}>
        <span className="material-symbols-outlined">security</span>
        CyberGuard
      </Link>

      {/* Links — solo visibles en desktop */}
      <div className={styles.links}>
        <NavLink to="/home" className={({ isActive }) => isActive ? styles.activeLink : ''}>Inicio</NavLink>
        <NavLink to="/amenazas" className={({ isActive }) => isActive ? styles.activeLink : ''}>Amenazas</NavLink>
        <NavLink to="/herramientas" className={({ isActive }) => isActive ? styles.activeLink : ''}>Herramientas</NavLink>
        <NavLink to="/biblioteca" className={({ isActive }) => isActive ? styles.activeLink : ''}>Biblioteca</NavLink>
        <NavLink to="/foro" className={({ isActive }) => isActive ? styles.activeLink : ''}>Foro</NavLink>
        <Link to="/login" className={styles.btnLogin}>Ingresar</Link>
      </div>

      {/* Mobile: solo botón Ingresar empujado a la derecha */}
      <div className={styles.mobileActions}>
        <Link to="/login" className={styles.btnLogin}>Ingresar</Link>
      </div>

    </nav>
  );
}
