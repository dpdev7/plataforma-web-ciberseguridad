import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import type { Recurso, TipoRecurso } from '../../../types/adminContent';
import { CATEGORIAS } from '../../../types/adminContent';

interface Props {
  onClose:   () => void;
  onConfirm: (data: Omit<Recurso, 'id'>) => void;
}

export default function ContentCreateModal({ onClose, onConfirm }: Props) {
  const [form, setForm] = useState({
    titulo:      '',
    descripcion: '',
    urlRecurso:  '',
    tipo:        'articulo' as TipoRecurso,
    categoria:   'redes',
    esPublico:   true,
  });

  const set = (key: string, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.titulo.trim()) return;
    onConfirm(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--lg" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__header-left">
            <span className="icon-wrap icon-wrap--md">
              <BookOpen size={16} />
            </span>
            <h2 className="modal__title">Nuevo recurso</h2>
          </div>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label>Título</label>
            <input
              className="form-input"
              placeholder="Título del recurso"
              value={form.titulo}
              onChange={e => set('titulo', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Descripción breve"
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>URL del recurso</label>
            <input
              className="form-input"
              placeholder="https://…"
              value={form.urlRecurso}
              onChange={e => set('urlRecurso', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                <option value="articulo">Artículo</option>
                <option value="guia">Guía</option>
              </select>
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)}>
                {CATEGORIAS.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group form-group--row">
            <label>Público</label>
            <input
              type="checkbox"
              checked={form.esPublico}
              onChange={e => set('esPublico', e.target.checked)}
            />
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn--primary" onClick={handleSubmit} disabled={!form.titulo.trim()}>
            Crear recurso
          </button>
        </div>

      </div>
    </div>
  );
}