// En desktop: sidebar fijo a la izquierda.
// En mobile: drawer deslizante controlado por `isOpen`.
// Se muestra con clase 'open' cuando isOpen=true
// El overlay oscuro cierra el drawer al hacer clic

import { TOC_ITEMS } from '../../constants/homeData'; // AÑADIR ARTICULOS SI SE DESEA SECCIÓN DE GUÍAS RECOMENDADAS

interface Props {
  activeSection: string;
  onScrollTo: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function TocSidebar({ activeSection, onScrollTo, isOpen, onClose }: Props) {

  const handleScrollTo = (id: string) => {
    onScrollTo(id);
    onClose();
  };

  const activeIndex  = TOC_ITEMS.findIndex(item => item.id === activeSection);
  const progreso     = Math.round(((activeIndex + 1) / TOC_ITEMS.length) * 100);

  return (
    <>
      {isOpen && (
        <div className="toc-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`toc-sidebar ${isOpen ? 'open' : ''}`}>

        {/* Encabezado con progreso */}
        <div className="toc-top">
          <p className="toc-header">En esta página</p>
        </div>
      
        {/* Barra de progreso */}
        <div className="toc-barra-fondo">
          <div
            className="toc-barra-relleno"
            style={{ width: `${progreso}%` }}
          />
        </div>

        <nav className="toc-nav" style={{ marginTop: '16px' }}>
          {TOC_ITEMS.map(({ id, icon, label }, index) => (
            <button
              key={id}
              className={`toc-item ${activeSection === id ? 'active' : ''}`}
              onClick={() => handleScrollTo(id)}
            >
              <span className="toc-item-numero">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="material-symbols-outlined toc-item-icon">{icon}</span>
              {label}
            </button>
          ))}

          {/* 
          <div className="toc-divider" />

          <p className="toc-header" style={{ marginTop: 4 }}>Guías Recomendadas</p>
          {ARTICULOS.map((a, i) => (
            <div key={i} className="toc-articulo">
              <p className="toc-articulo-titulo">{a.titulo}</p>
              <p className="toc-articulo-tiempo">⏱ {a.tiempo}</p>
            </div>
          ))}
          */}

        </nav>

        

      </aside>
    </>
  );
}