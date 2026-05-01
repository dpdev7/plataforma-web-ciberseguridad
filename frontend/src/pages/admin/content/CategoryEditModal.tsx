import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

interface Categoria {
  categoria_id: string;
  nombre: string;
  descripcion: string;
}

interface Props {
  categoria: Categoria;
  onClose:   () => void;
  onConfirm: () => void;
}

export default function CategoryEditModal({ categoria, onClose, onConfirm }: Props) {
  const [form, setForm] = useState({
    nombre:      categoria.nombre,
    descripcion: categoria.descripcion,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const set = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.nombre.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/categoria/editar/${categoria.categoria_id}/`, {
        method:      'PATCH',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message ?? 'Error al editar');

      onConfirm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--lg" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__header-left">
            <span className="icon-wrap icon-wrap--md"><BookOpen size={16} /></span>
            <h2 className="modal__title">Editar categoría</h2>
          </div>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label>Nombre</label>
            <input
              className="form-input"
              placeholder="Ej: Seguridad Web"
              value={form.nombre}
              onChange={e => set('nombre', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Descripción de la categoría"
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
            />
          </div>
          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>}
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose} disabled={loading}>Cancelar</button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!form.nombre.trim() || loading}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

      </div>
    </div>
  );
}