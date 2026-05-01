import { NavLink } from 'react-router-dom';
import '../../styles/BottomNav.css';

const NAV_ITEMS = [
  { to: '/home', icon: 'home', label: 'Inicio' },
  { to: '/amenazas', icon: 'gpp_maybe', label: 'Amenazas' },
  { to: '/herramientas', icon: 'build', label: 'Herramientas' },
  { to: '/biblioteca', icon: 'local_library', label: 'Biblioteca' },
  { to: '/foro', icon: 'forum', label: 'Foro' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación inferior">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
          }
        >
          <span
            className="material-symbols-outlined bottom-nav__icon"
            aria-hidden="true"
          >
            {item.icon}
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}