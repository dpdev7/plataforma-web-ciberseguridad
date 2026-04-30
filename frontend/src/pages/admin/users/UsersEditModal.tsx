// Modal para editar los datos de un usuario existente.
// Permite cambiar el rol (usuario/admin) y el estado de la cuenta (activo/inactivo).
// El username y correo se muestran como solo lectura — no son editables desde aquí.
// Al conectar backend: en handleSubmit llamar PATCH /api/admin/users/:id/
// antes de ejecutar onSave.

import { useState } from 'react';
import { X, UserCog } from 'lucide-react';

interface User {
  id: string;
  nombre: string;
  email: string;
  es_administrador: boolean;
  activo: boolean;
}

interface Props {
  user: User;
  onClose: () => void;
  onSave: (updated: User) => void;
}

export default function UserEditModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    nombre: user.nombre,
    es_administrador: user.es_administrador,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://backend-web-ciberseguridad.onrender.com/usuario/update/${user.id}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al actualizar el usuario');

      onSave({ ...user, ...form });
    } catch (err) {
      setError('No se pudo actualizar el usuario. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
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

          <div className="form-group">
            <label>Correo</label>
            <p className="form-static">{user.email}</p>
          </div>

          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="es_administrador">Rol</label>
            <select
              id="es_administrador"
              value={form.es_administrador ? 'admin' : 'user'}
              onChange={e => setForm(f => ({ ...f, es_administrador: e.target.value === 'admin' }))}
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>}

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}