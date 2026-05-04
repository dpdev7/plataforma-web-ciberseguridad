import { useState, useEffect } from 'react';
import { X, Pencil } from 'lucide-react';
import type { Recurso, TipoRecurso } from '../../../types/adminContent';
import { apiFetch } from '../../../utils/api';
interface Categoria {
  categoria_id: string;
  nombre: string;
}

interface Props {
  recurso:   Recurso;
  onClose:   () => void;
  onConfirm: (data: Recurso) => void;
}

export default function ContentEditModal({ recurso, onClose, onConfirm }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState({ ...recurso });

  useEffect(() => {
apiFetch('/categoria/obtener/all/')
  .then(data => {
    if (data.success) {
      setCategorias(data.result);
    }
  })
  .catch((err) => {
    console.log('CATEGORIAS ERROR:', err);
  });
  }, []);

  const set = (key: string, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--lg" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__header-left">
            <span className="icon-wrap icon-wrap--md">
              <Pencil size={16} />
            </span>
            <h2 className="modal__title">Editar recurso</h2>
          </div>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label>Título</label>
            <input
              className="form-input"
              value={form.titulo}
              onChange={e => set('titulo', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              className="form-input form-textarea"
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>URL del recurso</label>
            <input
              className="form-input"
              value={form.urlRecurso}
              onChange={e => set('urlRecurso', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value as TipoRecurso)}>
                <option value="articulo">Artículo</option>
                <option value="guia">Guía</option>
              </select>
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select
                value={form.categoria}
                onChange={e => set('categoria', e.target.value)}
              >
<option value="">-- Selecciona una categoría --</option>
{categorias.map(c => (
  <option key={c.categoria_id} value={c.categoria_id}>
    {c.nombre}
  </option>
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
          <button className="btn btn--primary" onClick={() => onConfirm(form)} disabled={!form.titulo.trim()}>
            Guardar cambios
          </button>
        </div>

      </div>
    </div>
  );
}