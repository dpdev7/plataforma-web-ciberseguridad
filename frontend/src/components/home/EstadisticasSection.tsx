// EstadisticasSection.tsx
// Cuatro cifras globales de ciberseguridad en un grid de 4 columnas con separadores verticales entre items.

import { ESTADISTICAS } from '../../constants/homeData';

export default function EstadisticasSection() {
  return (
    <section id="estadisticas" className="doc-section">
      <p className="doc-section-label">Datos Globales</p>
      <h2>Estadísticas</h2>
      <p className="doc-section-intro">
        Comprende la magnitud de las amenazas cibernéticas a nivel mundial.
      </p>

      {/* Caja contenedora con borde y fondo de tarjeta */}
      <div className="estadisticas-caja">
        <div className="estadisticas-grid">
          {ESTADISTICAS.map((e, i) => (
            // El primer item no tiene border-left (ver CSS)
            <div key={i} className="estadistica-item">
              <p className="estadistica-numero">{e.num}</p>
              <p className="estadistica-label">{e.label}</p>
              <p className="estadistica-desc">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
