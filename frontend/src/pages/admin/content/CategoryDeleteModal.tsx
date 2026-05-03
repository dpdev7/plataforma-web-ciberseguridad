import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { API_BACKEND } from '../../../utils/api';


interface Props {
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
  categoryId: string;  
}

export default function CategoryDeleteModal({ onClose, onConfirm, categoryName, categoryId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BACKEND}/categoria/eliminar/${categoryId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Error al eliminar la categoría');

      onConfirm();
    } catch {
      setError('No se pudo eliminar la categoría. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '8px' }}>{error}</p>}
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn--danger" onClick={handleDelete} disabled={loading}>
            <Trash2 size={14} /> {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>

      </div>
    </div>
  );
}