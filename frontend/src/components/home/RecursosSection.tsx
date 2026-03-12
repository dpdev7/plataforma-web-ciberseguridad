// Tres tarjetas de acceso rápido a secciones principales de la plataforma: Herramientas, Biblioteca y Foro.
// Íconos de Material Symbols — requieren line-height en CSS para centrarse correctamente (ver .tarjeta-icono en CSS).

import { Link } from 'react-router-dom';
import { RECURSOS } from '../../constants/homeData';

export default function RecursosSection() {
  return (
    <section id="recursos" className="doc-section">
      <p className="doc-section-label">Herramientas</p>
      <h2>Recursos</h2>
      <p className="doc-section-intro">
        Todo lo que necesitas para fortalecer tu seguridad digital.
      </p>

      <div className="recursos-grid">
        {RECURSOS.map((r, i) => (
          <div key={i} className="recurso-tarjeta">
            {/* Material Symbols necesita .tarjeta-icono.material-symbols-outlined
                con line-height: 56px para centrarse dentro del círculo */}
            <span className="material-symbols-outlined tarjeta-icono">{r.icon}</span>
            <p className="tarjeta-titulo">{r.titulo}</p>
            <p className="tarjeta-texto">{r.desc}</p>
            <Link to={r.href} className="tarjeta-link">{r.label}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
