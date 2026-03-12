// Barra de navegación global fija.
// Autónoma: sus estilos viven en Navbar.module.css.
// En mobile muestra: logo + botón hamburguesa + botón "Ingresar".
// Props opcionales: solo Home las necesita para el drawer del TOC.

import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

interface Props {
  onMenuToggle?: () => void; // Opcional — solo necesario en páginas con TOC
  menuOpen?: boolean;        // Opcional — solo necesario en páginas con TOC
}

export default function Navbar({ onMenuToggle, menuOpen }: Props) {
  return (
    <nav className={styles.navbar}>

      <Link to="/" className={styles.logo}>
        <span className="material-symbols-outlined">security</span>
        CyberGuard
      </Link>

      <div className={styles.links}>
        <Link to="/home">Inicio</Link>
        <Link to="/amenazas">Amenazas</Link>
        <Link to="/herramientas">Herramientas</Link>
        <Link to="/biblioteca">Biblioteca</Link>
        <Link to="/foro">Foro</Link>
        <Link to="/login" className={styles.btnLogin}>Ingresar</Link>
      </div>

      <div className={styles.mobileActions}>
        <Link to="/login" className={styles.btnLogin}>Ingresar</Link>
        {onMenuToggle && (
          <button
            className={styles.hamburger}
            onClick={onMenuToggle}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

    </nav>
  );
}
