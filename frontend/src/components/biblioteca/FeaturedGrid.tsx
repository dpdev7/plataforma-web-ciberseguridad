import type { ReactElement } from 'react';
import { ArrowRight, BookOpen, FileText } from 'lucide-react';
import type { Recurso } from '../../types/biblioteca';

const TIPO_ICON: Record<string, ReactElement> = {
  articulo:     <FileText size={12} />,
  guia:         <BookOpen size={12} />,
  cuestionario: <BookOpen size={12} />,
};

const TIPO_LABEL: Record<string, string> = {
  articulo:     'Artículo',
  guia:         'Guía',
  cuestionario: 'Cuestionario',
};

interface Props {
  recursos:  Recurso[];
  onLimpiar: () => void;
}

export default function FeaturedGrid({ recursos, onLimpiar }: Props) {
  if (recursos.length === 0) {
    return (
      <div className="bib-empty">
        <p className="bib-empty__title">Sin resultados para este tema</p>
        <p className="bib-empty__desc">No hay contenido bajo esta categoría todavía.</p>
        <button className="bib-empty__btn" onClick={onLimpiar}>Quitar filtro</button>
      </div>
    );
  }

  return (
    <div className="bib-featured">
      {recursos.map((r, i) => (
        <a
          key={r.id}
          href={r.urlRecurso ?? '#'}           // 👈 URL externa del backend
          target="_blank"
          rel="noopener noreferrer"
          className={`bib-card ${i === 0 ? 'bib-card--wide' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          {r.imagen && (
            <div className="bib-card__thumb">
              <img src={r.imagen} alt={r.titulo} loading={i === 0 ? 'eager' : 'lazy'} />
              <div className="bib-card__thumb-overlay" />
            </div>
          )}
          <div className="bib-card__body">
            <div className="bib-card__type">
              {TIPO_ICON[r.tipo] ?? <FileText size={12} />}
              <span>{TIPO_LABEL[r.tipo] ?? r.tipo}</span>
              {r.tiempoLectura && (
                <>
                  <span className="bib-card__dot" />
                  <span className="bib-card__time">{r.tiempoLectura} min lectura</span>
                </>
              )}
            </div>
            <h3 className="bib-card__title">{r.titulo}</h3>
            <p className="bib-card__desc">{r.descripcion}</p>
            <span className="bib-card__cta">
              Leer <ArrowRight size={12} />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}