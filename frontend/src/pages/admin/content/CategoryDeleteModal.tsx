import { X, Trash2 } from 'lucide-react';

interface Props {
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
}

export default function CategoryDeleteModal({ onClose, onConfirm, categoryName }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <h2 className="modal__title">Eliminar categoría</h2>
          <button className="modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal__body">
          <p>
            ¿Estás seguro que deseas eliminar <strong>{categoryName}</strong>? 
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn btn--danger" onClick={onConfirm}>
            <Trash2 size={14} /> Eliminar
          </button>
        </div>

      </div>
    </div>
  );
}