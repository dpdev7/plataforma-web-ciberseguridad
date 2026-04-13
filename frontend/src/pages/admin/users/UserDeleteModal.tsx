// Modal de confirmación antes de eliminar un usuario.
// Muestra el nombre y correo del usuario afectado para evitar eliminaciones accidentales.
// Al conectar backend: en onConfirm (definido en UsersPage) llamar DELETE /api/admin/users/:id/ antes de actualizar el estado local.

import { Trash2, X } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Props {
  user: User;
  onClose: () => void;
  onConfirm: () => void; // ejecuta la eliminación real definida en UsersPage
}

export default function UserDeleteModal({ user, onClose, onConfirm }: Props) {
  return (
    // Click en el overlay cierra el modal sin eliminar
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation evita que el click dentro del modal lo cierre */}
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__header-left">
            {/* Ícono en rojo para reforzar la acción destructiva */}
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
          {/* Mensaje de advertencia con el nombre del usuario resaltado */}
          <p className="delete-confirm__text">
            ¿Estás seguro que deseas eliminar al usuario{' '}
            <strong>{user.username}</strong>?
            Esta acción no se puede deshacer.
          </p>
          {/* Correo como referencia adicional del usuario a eliminar */}
          <p className="form-static">{user.email}</p>
        </div>

        <div className="modal__footer">
          {/* Cancelar — cierra sin hacer nada */}
          <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          {/* Confirmar — ejecuta la eliminación */}
          <button className="btn btn--danger" onClick={onConfirm}>Eliminar</button>
        </div>

      </div>
    </div>
  );
}