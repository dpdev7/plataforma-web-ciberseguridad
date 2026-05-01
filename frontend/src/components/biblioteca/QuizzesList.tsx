import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import type { Recurso } from '../../types/biblioteca';

interface Props {
  recursos: Recurso[];
  onLimpiar: () => void;
}

export default function QuizzesList({ recursos, onLimpiar }: Props) {
  if (recursos.length === 0) {
    return (
      <div className="bib-empty">
        <p className="bib-empty__title">Sin cuestionarios para este filtro</p>
        <p className="bib-empty__desc">
          No hay cuestionarios disponibles con los filtros actuales.
        </p>
        <button className="bib-empty__btn" onClick={onLimpiar} type="button">
          Quitar filtro
        </button>
      </div>
    );
  }

  return (
    <div className="bib-list bib-list--grid">
      {recursos.map((r) => (
        <Link
          key={r.id}
          to={`/biblioteca/cuestionario/${r.id}`}
          className="bib-row"
          style={{ textDecoration: 'none' }}
        >
          <div className="bib-row__thumb bib-row__thumb--icon">
            <HelpCircle size={16} />
          </div>

          <div className="bib-row__body">
            <div className="bib-row__label">Cuestionario</div>
            <div className="bib-row__title">{r.titulo}</div>
            <div className="bib-row__desc">{r.descripcion}</div>
          </div>

          <div className="bib-row__meta">
            {r.preguntas ? <span>{r.preguntas} preguntas</span> : null}
          </div>
        </Link>
      ))}
    </div>
  );
}