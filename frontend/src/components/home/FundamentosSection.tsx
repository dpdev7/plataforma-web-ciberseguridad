// FundamentosSection.tsx
// Sección de fundamentos de ciberseguridad (triada CIA).
// Layout de dos columnas: texto explicativo + timeline  vertical con los pilares (Confidencialidad, Integridad, Disponibilidad y contexto).

import { PILARES } from '../../constants/homeData';

export default function FundamentosSection() {
  return (
    <section id="conceptos" className="doc-section fundamentos-section">
      <div className="fundamentos-inner">

        {/* Columna izquierda: descripción y CTA */}
        <div className="fundamentos-texto">
          <p className="doc-section-label">Fundamentos</p>
          <h2>¿Qué es Ciberseguridad?</h2>
          <p className="fundamentos-desc">
            Es la práctica de proteger sistemas, redes y programas de ataques digitales
            que buscan acceder, alterar o destruir información sensible, extorsionar
            usuarios o interrumpir procesos críticos. Abarca desde la protección de
            dispositivos personales hasta la seguridad de infraestructuras nacionales.
          </p>
          <p className="fundamentos-desc">
            Se sostiene sobre tres principios clave — confidencialidad, integridad y
            disponibilidad — que juntos garantizan que la información esté protegida,
            sea confiable y siempre accesible para quienes la necesitan.
          </p>
          <p className="fundamentos-desc">
            En un mundo donde todo está conectado, cualquier persona o empresa puede
            ser un objetivo. Entender estos fundamentos es el primer paso para tomar
            decisiones informadas y navegar de forma más segura.
          </p>
          
        </div>

        {/* Columna derecha: timeline vertical de pilares */}
        <ol className="fundamentos-timeline">
          {PILARES.map((p, i) => (
            <li key={i} className="fundamentos-step">
              <div className="fundamentos-step-left">
                {/* Círculo con ícono */}
                <div className="fundamentos-step-icon-wrap">
                  <span className="material-symbols-outlined fundamentos-step-icon">
                    {p.icon}
                  </span>
                </div>
                {/* Línea conectora — no se muestra en el último item */}
                {i < PILARES.length - 1 && <div className="fundamentos-step-line" />}
              </div>
              <div className="fundamentos-step-body">
                <p className="fundamentos-step-titulo">{p.titulo}</p>
                <p className="fundamentos-step-desc">{p.desc}</p>
              </div>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
