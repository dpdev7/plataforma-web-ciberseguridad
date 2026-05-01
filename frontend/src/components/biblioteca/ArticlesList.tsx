import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import type { Recurso } from '../../types/biblioteca';

interface Props {
  recursos: Recurso[];
  onLimpiar: () => void;
}

const TIPO_ICON: Record<string, ReactElement> = {
  articulo: <FileText size={18} />,
  guia: <BookOpen size={18} />,
  cuestionario: <HelpCircle size={18} />,
};

const TIPO_LABEL: Record<string, string> = {
  articulo: 'Artículo',
  guia: 'Guía',
  cuestionario: 'Cuestionario',
};

export default function ArticlesList({ recursos, onLimpiar }: Props) {
  if (recursos.length === 0) {
    return (
      <div className="bib-empty">
        <p className="bib-empty__title">Sin recursos para este filtro</p>
        <p className="bib-empty__desc">
          No hay contenido disponible con la combinación actual.
        </p>
        <button className="bib-empty__btn" onClick={onLimpiar} type="button">
          Quitar filtro
        </button>
      </div>
    );
  }

  return (
    <div className="bib-list">
      {recursos.map((r) => {
        const esCuestionario = r.tipo === 'cuestionario';

        const rowContent = (
          <>
            <div className="bib-row__thumb bib-row__thumb--icon">
              {TIPO_ICON[r.tipo] ?? <FileText size={18} />}
            </div>

            <div className="bib-row__body">
              <div className="bib-row__label">{TIPO_LABEL[r.tipo] ?? r.tipo}</div>
              <div className="bib-row__title">{r.titulo}</div>
              <div className="bib-row__desc">{r.descripcion}</div>
            </div>

            <div className="bib-row__meta">
              {esCuestionario && r.preguntas ? (
                <span>{r.preguntas} preguntas</span>
              ) : r.tiempoLectura ? (
                <span>{r.tiempoLectura} min</span>
              ) : null}
            </div>
          </>
        );

        if (esCuestionario) {
          return (
            <Link
              key={r.id}
              to={`/biblioteca/cuestionario/${r.id}`}
              className="bib-row"
              style={{ textDecoration: 'none' }}
            >
              {rowContent}
            </Link>
          );
        }

        return (
          <a
            key={r.id}
            href={r.urlRecurso ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bib-row"
            style={{ textDecoration: 'none' }}
          >
            {rowContent}
          </a>
        );
      })}
    </div>
  );
}