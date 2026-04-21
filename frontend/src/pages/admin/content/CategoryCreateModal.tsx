import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

interface Props {
  onClose: () => void;
  onConfirm: (data: { nombre: string; descripcion: string }) => void;
  initialData?: { nombre: string; descripcion: string };
}

export default function CategoryCreateModal({ onClose, onConfirm, initialData }: Props) {
  const [form, setForm] = useState({
  nombre: initialData?.nombre || '',
  descripcion: initialData?.descripcion || '',
});

  const set = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.nombre.trim()) return;
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
            <h2 className="modal__title">
  {initialData ? 'Editar categoría' : 'Nueva categoría'}
</h2>
          </div>
          <button className="modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label>Título</label>
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
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!form.nombre.trim()}
          >
            {initialData ? 'Guardar cambios' : 'Crear categoría'}
          </button>
        </div>

      </div>
    </div>
  );
}