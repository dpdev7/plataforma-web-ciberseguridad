// Sección de amenazas comunes y consejos de prevención.
// Estructura:
//   1. Dos tarjetas con imagen (Tipos de amenazas / Prevención)
//   2. Grid de dos columnas: amenaza (izq) + consejo (der)
//      Los índices de AMENAZAS y CONSEJOS deben coincidir.
//   3. CTA hacia la guía completa de amenazas.

import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { AMENAZAS, CONSEJOS } from '../../constants/homeData';
import imgAmenazas   from '../../assets/images/cybercard-tips.webp';
import imgPrevencion from '../../assets/images/cybercard-types.webp';

export default function AmenazasSection() {
  return (
    <section id="amenazas" className="doc-section">
      <p className="doc-section-label">Seguridad</p>
      <h2>Amenazas Comunes</h2>
      <p className="doc-section-intro">
        Conoce las amenazas más frecuentes y cómo protegerte de ellas.
      </p>

      <div className="amenazas-wrapper">

        {/* Tarjetas con imagen de portada */}
        <div className="amenazas-cards-grid">
          <div className="amenaza-card-header">
            <img src={imgAmenazas} alt="Tipos de Amenazas" className="amenaza-card-img" />
            <div className="amenaza-card-body">
              <h3 className="amenaza-card-titulo">Tipos de Amenazas</h3>
              <p className="amenaza-card-desc">
                Conoce los diferentes tipos de ciberataques y cómo identificarlos.
              </p>
            </div>
          </div>
          <div className="amenaza-card-header">
            <img src={imgPrevencion} alt="Prevención" className="amenaza-card-img" />
            <div className="amenaza-card-body">
              <h3 className="amenaza-card-titulo">Prevención</h3>
              <p className="amenaza-card-desc">
                Aprende las mejores prácticas para protegerte de las amenazas cibernéticas.
              </p>
            </div>
          </div>
        </div>

        {/* Grid pareado: cada amenaza tiene su consejo al lado.
            Fragment con key para evitar el warning de React
            al usar múltiples elementos sin wrapper en un map. */}
        <div className="amenazas-filas-grid">
          {AMENAZAS.map((a, i) => (
            <Fragment key={i}>
              {/* Columna izquierda — amenaza */}
              <div className="card-item amenaza-item">
                <div className="icon-wrap amenaza-icono-wrap">{a.icon}</div>
                <div>
                  <p className="card-titulo">{a.title}</p>
                  <p className="card-desc">{a.desc}</p>
                </div>
              </div>
              {/* Columna derecha — consejo relacionado */}
              <div className="card-item consejo-item">
                <div className="icon-wrap consejo-check-wrap">
                  <Check size={14} />
                </div>
                <div>
                  <p className="card-titulo">{CONSEJOS[i].title}</p>
                  <p className="card-desc">{CONSEJOS[i].desc}</p>
                </div>
              </div>
            </Fragment>
          ))}
        </div>

        {/* CTA centrado hacia la página de amenazas */}
        <div className="amenazas-cta-wrap">
          <Link to="/amenazas" className="btn-primario">
            Ver guía completa de amenazas →
          </Link>
        </div>

      </div>
    </section>
  );
}
