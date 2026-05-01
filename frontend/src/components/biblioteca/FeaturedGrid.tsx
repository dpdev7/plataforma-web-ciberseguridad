import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  FileText,
  HelpCircle,
} from 'lucide-react';
import type { Recurso } from '../../types/biblioteca';

const TIPO_ICON: Record<string, ReactElement> = {
  articulo: <FileText size={12} />,
  guia: <BookOpen size={12} />,
  cuestionario: <HelpCircle size={12} />,
};

const TIPO_LABEL: Record<string, string> = {
  articulo: 'Artículo',
  guia: 'Guía',
  cuestionario: 'Cuestionario',
};

interface Props {
  recursos: Recurso[];
  onLimpiar: () => void;
}

export default function FeaturedGrid({ recursos, onLimpiar }: Props) {
  if (recursos.length === 0) {
    return (
      <div className="bib-empty">
        <p className="bib-empty__title">Sin resultados para este tema</p>
        <p className="bib-empty__desc">
          No hay contenido bajo esta categoría todavía.
        </p>
        <button className="bib-empty__btn" onClick={onLimpiar} type="button">
          Quitar filtro
        </button>
      </div>
    );
  }

  return (
    <div className="bib-featured">
      {recursos.map((r, i) => {
        const esCuestionario = r.tipo === 'cuestionario';

        const cardContent = (
          <div className={`bib-card ${i === 0 ? 'bib-card--wide' : ''}`}>
            <div className="bib-card__body">
              <div className="bib-card__type">
                {TIPO_ICON[r.tipo] ?? <FileText size={12} />}
                <span>{TIPO_LABEL[r.tipo] ?? r.tipo}</span>

                {r.tiempoLectura && !esCuestionario && (
                  <>
                    <span className="bib-card__dot" />
                    <span className="bib-card__time">{r.tiempoLectura} min lectura</span>
                  </>
                )}

                {esCuestionario && r.preguntas ? (
                  <>
                    <span className="bib-card__dot" />
                    <span className="bib-card__time">{r.preguntas} preguntas</span>
                  </>
                ) : null}
              </div>

              <h3 className="bib-card__title">{r.titulo}</h3>
              <p className="bib-card__desc">{r.descripcion}</p>

              <span className="bib-card__cta">
                {esCuestionario ? 'Resolver' : 'Leer'} <ArrowRight size={12} />
              </span>
            </div>
          </div>
        );

        if (esCuestionario) {
          return (
            <Link
              key={r.id}
              to={`/biblioteca/cuestionario/${r.id}`}
              style={{ textDecoration: 'none' }}
            >
              {cardContent}
            </Link>
          );
        }

        return (
          <a
            key={r.id}
            href={r.urlRecurso ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            {cardContent}
          </a>
        );
      })}
    </div>
  );
}