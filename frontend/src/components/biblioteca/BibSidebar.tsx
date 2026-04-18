import type { ReactElement } from 'react';
import {
  BookOpen, FileText, HelpCircle, LayoutGrid,
  Shield, Lock, Key, User, Database, Zap, Sun,
} from 'lucide-react';
import type { TipoContenido } from '../../types/biblioteca';

const TEMA_ICONS: Record<string, ReactElement> = {
  all:      <Sun      size={13} />,
  redes:    <Shield   size={13} />,
  cripto:   <Lock     size={13} />,
  acceso:   <Key      size={13} />,
  usuario:  <User     size={13} />,
  datos:    <Database size={13} />,
  amenazas: <Zap      size={13} />,
};

const TIPO_ICONS: Record<string, ReactElement> = {
  all:          <LayoutGrid size={13} />,
  articulo:     <FileText   size={13} />,
  guia:         <BookOpen   size={13} />,
  cuestionario: <HelpCircle size={13} />,
};

interface Props {
  tipos:         { id: TipoContenido | 'all'; label: string }[];
  temas:         { id: string; label: string }[];
  tipoActivo:    TipoContenido | 'all';
  temaActivo:    string;
  conteoPorTema: Record<string, number>;
  onTipoChange:  (tipo: TipoContenido | 'all') => void;
  onTemaChange:  (tema: string) => void;
}

export default function BibSidebar({
  tipos, temas, tipoActivo, temaActivo, conteoPorTema, onTipoChange, onTemaChange,
}: Props) {
  return (
    <aside className="bib-sidebar">

      <p className="bib-sidebar__header">Tipo de contenido</p>
      <nav className="bib-sidebar__nav">
        {tipos.map(({ id, label }) => (
          <button
            key={id}
            className={`bib-sidebar__btn ${tipoActivo === id ? 'bib-sidebar__btn--active' : ''}`}
            onClick={() => onTipoChange(id as TipoContenido | 'all')}
          >
            <span className="bib-sidebar__icon">{TIPO_ICONS[id]}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="bib-sidebar__divider" />

      <p className="bib-sidebar__header">Filtrar por tema</p>
      <nav className="bib-sidebar__nav">
        {temas.map(({ id, label }) => (
          <button
            key={id}
            className={`bib-sidebar__btn ${temaActivo === id ? 'bib-sidebar__btn--active' : ''}`}
            onClick={() => onTemaChange(id)}
          >
            <span className="bib-sidebar__icon">{TEMA_ICONS[id] ?? <Shield size={13} />}</span>
            <span className="bib-sidebar__btn-label">{label}</span>
            {id !== 'all' && (
              <span className="bib-sidebar__count">{conteoPorTema[id] ?? 0}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}