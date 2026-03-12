// En desktop: sidebar fijo a la izquierda.
// En mobile: drawer deslizante controlado por `isOpen`.
// Se muestra con clase 'open' cuando isOpen=true
// El overlay oscuro cierra el drawer al hacer clic

import { TOC_ITEMS, ARTICULOS } from '../../constants/homeData';

interface Props {
  activeSection: string;
  onScrollTo: (id: string) => void;
  isOpen: boolean;       // Controla visibilidad en mobile
  onClose: () => void;   // Cierra el drawer en mobile
}

export default function TocSidebar({ activeSection, onScrollTo, isOpen, onClose }: Props) {

  const handleScrollTo = (id: string) => {
    onScrollTo(id);
    onClose(); // Cierra el drawer automáticamente al navegar
  };

  return (
    <>
      {/* Overlay oscuro detrás del drawer — solo en mobile */}
      {isOpen && (
        <div className="toc-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`toc-sidebar ${isOpen ? 'open' : ''}`}>
        <p className="toc-header">En esta página</p>

        <nav className="toc-nav">
          {TOC_ITEMS.map(({ id, icon, label }) => (
            <button
              key={id}
              className={`toc-item ${activeSection === id ? 'active' : ''}`}
              onClick={() => handleScrollTo(id)}
            >
              <span className="material-symbols-outlined toc-item-icon">{icon}</span>
              {label}
            </button>
          ))}

          <div className="toc-divider" />

          <p className="toc-header" style={{ marginTop: 4 }}>Guías Recomendadas</p>
          {ARTICULOS.map((a, i) => (
            <div key={i} className="toc-articulo">
              <p className="toc-articulo-titulo">{a.titulo}</p>
              <p className="toc-articulo-tiempo">⏱ {a.tiempo}</p>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
