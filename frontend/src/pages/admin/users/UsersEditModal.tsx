// Modal para editar los datos de un usuario existente.
// Permite cambiar el rol (usuario/admin) y el estado de la cuenta (activo/inactivo).
// El username y correo se muestran como solo lectura — no son editables desde aquí.
// Al conectar backend: en handleSubmit llamar PATCH /api/admin/users/:id/
// antes de ejecutar onSave.

import { useState } from 'react';
import { X, UserCog } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  is_active: boolean;
}

interface Props {
  user: User;
  onClose: () => void;
  onSave: (updated: User) => void;
}

export default function UserEditModal({ user, onClose, onSave }: Props) {
  // Solo se editan role e is_active — los demás campos son de solo lectura
  const [form, setForm] = useState({ role: user.role, is_active: user.is_active });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fusiona los campos editados con el resto del objeto usuario
    // Al conectar backend: hacer fetch PATCH aquí y llamar onSave con la respuesta
    onSave({ ...user, ...form });
  };

  return (
    // Click en el overlay cierra el modal
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation evita que el click dentro del modal lo cierre */}
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__header-left">
            <span className="icon-wrap icon-wrap--md">
              <UserCog size={16} />
            </span>
            <h2 className="modal__title">Editar usuario</h2>
          </div>
          <button className="modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">

          {/* Campos de solo lectura — informativos */}
          <div className="form-group">
            <label>Usuario</label>
            <p className="form-static">{user.username}</p>
          </div>

          <div className="form-group">
            <label>Correo</label>
            <p className="form-static">{user.email}</p>
          </div>

          {/* Selector de rol — user o admin */}
          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value as User['role'] }))}
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Toggle de estado de la cuenta */}
          <div className="form-group form-group--row">
            <label htmlFor="is_active">Cuenta activa</label>
            <input
              id="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
            />
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn--primary">Guardar</button>
          </div>

        </form>
      </div>
    </div>
  );
}