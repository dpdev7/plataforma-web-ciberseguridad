import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Key, User, Database, Zap } from 'lucide-react';
import type { Recurso } from '../../types/biblioteca';

const TEMA_ICONS: Record<string, ReactElement> = {
  redes:    <Shield   size={18} />,
  cripto:   <Lock     size={18} />,
  acceso:   <Key      size={18} />,
  usuario:  <User     size={18} />,
  datos:    <Database size={18} />,
  amenazas: <Zap      size={18} />,
  general:  <Shield   size={18} />,
};

const TEMA_LABELS: Record<string, string> = {
  redes:    'Redes',
  cripto:   'Criptografía',
  acceso:   'Control de Acceso',
  usuario:  'Conciencia',
  datos:    'Seguridad de Datos',
  amenazas: 'Amenazas',
  general:  'General',
};

interface Props {
  recursos:  Recurso[];
  onLimpiar: () => void;
}

export default function QuizzesList({ recursos, onLimpiar }: Props) {
  if (recursos.length === 0) {
    return (
      <div className="bib-empty">
        <p className="bib-empty__title">Sin cuestionarios para este tema</p>
        <button className="bib-empty__btn" onClick={onLimpiar}>Quitar filtro</button>
      </div>
    );
  }

  return (
    <div className="bib-list bib-list--grid">
      {recursos.map(r => (
        // Link envuelve cada cuestionario — navega al quiz
        <Link
          key={r.id}
          to={`/biblioteca/cuestionario/${r.id}`}
          className="bib-row"
          style={{ textDecoration: 'none' }}
        >
          <div className="bib-row__thumb bib-row__thumb--icon">
            {TEMA_ICONS[r.tema] ?? <Shield size={18} />}
          </div>
          <div className="bib-row__body">
            <div className="bib-row__label">{TEMA_LABELS[r.tema] ?? r.tema}</div>
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