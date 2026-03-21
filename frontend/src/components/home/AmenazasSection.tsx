// Sección de la página principal que muestra las amenazas cibernéticas comunes
// y los consejos de prevención correspondientes en dos columnas paralelas.
// Estructura de layout:
//   Desktop → 2 columnas con CSS Subgrid: las filas de ambas columnas se alinean
//             automáticamente sin JavaScript (banner izq ↔ banner der, card[i] ↔ card[i])
//   Mobile  → 1 columna, el orden del DOM ya es el correcto:
//             banner amenazas → cards amenazas → banner prevención → cards consejos

import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { AMENAZAS, CONSEJOS } from '../../constants/homeData';
import imgAmenazas   from '../../assets/images/cybercard-tips.webp';
import imgPrevencion from '../../assets/images/cybercard-types.webp';

export default function AmenazasSection() {
  return (
    <section id="amenazas" className="doc-section">

      {/* Etiqueta de categoría, título e introducción de la sección */}
      <p className="doc-section-label">Seguridad</p>
      <h2>Amenazas Comunes</h2>
      <p className="doc-section-intro">
        Conoce las amenazas más frecuentes y cómo protegerte de ellas.
      </p>

      <div className="amenazas-wrapper">

        {/* Grid padre de 2 columnas con 6 filas explícitas (1 banner + 5 cards).
          Las columnas hijas usan subgrid para heredar esas filas exactas,
          logrando que cada par de cards quede a la misma altura.
          Si se añade/quita amenazas, se debe actualizar repeat(N) en el CSS también. */}
        <div className="amenazas-grid">

          {/* COLUMNA IZQUIERDA: Tipos de Amenazas */}
          <div className="amenazas-col amenazas-col--izq">

            {/* Banner con imagen de fondo y texto superpuesto con gradiente */}
            <div className="amenaza-card-header">
              <div
                className="amenaza-card-img"
                style={{ backgroundImage: `url(${imgAmenazas})` }}
                aria-hidden="true" // decorativa, no necesita descripción para lectores de pantalla
              />
              <div className="amenaza-card-body">
                <h3 className="amenaza-card-titulo">Tipos de Amenazas</h3>
                <p className="amenaza-card-desc">
                  Conoce los diferentes tipos de ciberataques y cómo identificarlos.
                </p>
              </div>
            </div>

            {/* Lista de cards de amenazas — una por cada item en AMENAZAS */}
            {AMENAZAS.map((a, i) => (
              <div key={i} className="card-item amenaza-item">
                {/* Ícono de la amenaza (SVG desde homeData) */}
                <div className="icon-wrap amenaza-icono-wrap">{a.icon}</div>
                <div>
                  <p className="card-titulo">{a.title}</p>
                  <p className="card-desc">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── COLUMNA DERECHA: Prevención ───────────────────────────────── */}
          <div className="amenazas-col amenazas-col--der">

            {/* Banner con imagen de fondo y texto superpuesto con gradiente */}
            <div className="amenaza-card-header">
              <div
                className="amenaza-card-img"
                style={{ backgroundImage: `url(${imgPrevencion})` }}
                aria-hidden="true"
              />
              <div className="amenaza-card-body">
                <h3 className="amenaza-card-titulo">Prevención</h3>
                <p className="amenaza-card-desc">
                  Aprende las mejores prácticas para protegerte de las amenazas cibernéticas.
                </p>
              </div>
            </div>

            {/* Lista de cards de consejos — CONSEJOS[i] corresponde a AMENAZAS[i] */}
            {CONSEJOS.map((c, i) => (
              <div key={i} className="card-item consejo-item">
                {/* Ícono de check genérico para todos los consejos */}
                <div className="icon-wrap consejo-check-wrap">
                  <Check size={14} />
                </div>
                <div>
                  <p className="card-titulo">{c.title}</p>
                  <p className="card-desc">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* CTA que lleva a la página completa de amenazas */}
        <div className="amenazas-cta-wrap">
          <Link to="/amenazas" className="btn-primario">
            Ver guía completa de amenazas →
          </Link>
        </div>

      </div>
    </section>
  );
}
