import { FileText } from 'lucide-react';
import type { Recurso } from '../../types/biblioteca';

interface Props {
  recursos:  Recurso[];
  onLimpiar: () => void;
}

export default function ArticlesList({ recursos, onLimpiar }: Props) {
  if (recursos.length === 0) {
    return (
      <div className="bib-empty">
        <p className="bib-empty__title">Sin artículos para este tema</p>
        <button className="bib-empty__btn" onClick={onLimpiar}>Quitar filtro</button>
      </div>
    );
  }

  return (
    <div className="bib-list">
      {recursos.map(r => (
        <a                                   
          key={r.id}
          href={r.urlRecurso ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="bib-row"
          style={{ textDecoration: 'none' }}
        >
          {r.imagen ? (
            <div className="bib-row__thumb">
              <img src={r.imagen} alt={r.titulo} loading="lazy" />
            </div>
          ) : (
            <div className="bib-row__thumb bib-row__thumb--icon">
              <FileText size={18} />
            </div>
          )}
          <div className="bib-row__body">
            <div className="bib-row__label">{r.tema}</div>
            <div className="bib-row__title">{r.titulo}</div>
            <div className="bib-row__desc">{r.descripcion}</div>
          </div>
          <div className="bib-row__meta">
            {r.tiempoLectura ? <span>{r.tiempoLectura} min</span> : null}
          </div>
        </a>
      ))}
    </div>
  );
}