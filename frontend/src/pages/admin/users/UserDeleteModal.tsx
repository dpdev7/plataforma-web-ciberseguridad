// Modal de confirmación antes de eliminar un usuario.
// Muestra el nombre y correo del usuario afectado para evitar eliminaciones accidentales.
// Al conectar backend: en onConfirm (definido en UsersPage) llamar DELETE /api/admin/users/:id/ antes de actualizar el estado local.

import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { API_BACKEND } from '../../../utils/api';


interface User {
  id: string;
  nombre: string;
  email: string;
}

interface Props {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}

export default function UserDeleteModal({ user, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BACKEND}/usuario/delete/${user.id}/`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Error al eliminar');

      onConfirm(); // 👈 actualiza el estado en UsersPage
    } catch {
      setError('No se pudo eliminar el usuario. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__header-left">
            <span className="icon-wrap icon-wrap--md icon-wrap--danger">
              <Trash2 size={16} />
            </span>
            <h2 className="modal__title">Eliminar usuario</h2>
          </div>
          <button className="modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal__body">
          <p className="delete-confirm__text">
            ¿Estás seguro que deseas eliminar a{' '}
            <strong>{user.nombre}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <p className="form-static">{user.email}</p>

          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>}
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn--danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>

      </div>
    </div>
  );
}