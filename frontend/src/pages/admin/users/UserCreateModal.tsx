import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

const API_BASE = "https://backend-web-ciberseguridad.onrender.com";

interface Props {
  onClose:   () => void;
  onConfirm: () => void;
}

export default function UserCreateModal({ onClose, onConfirm }: Props) {
  const [form, setForm] = useState({
    nombre:           '',
    email:            '',
    password:         '',
    es_administrador: false,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const set = (key: string, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/usuario/admin/crear/`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:           form.nombre,
          email:            form.email,
          password:         form.password,
          es_administrador: form.es_administrador,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(
        typeof data.message === 'object'
          ? JSON.stringify(data.message)
          : data.message ?? 'Error al crear el usuario'
      );

      onConfirm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
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
              <UserPlus size={16} />
            </span>
            <h2 className="modal__title">Nuevo usuario</h2>
          </div>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label>Nombre</label>
            <input
              className="form-input"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={e => set('nombre', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input
              className="form-input"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={e => set('password', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Rol</label>
            <select
              value={form.es_administrador ? 'admin' : 'user'}
              onChange={e => set('es_administrador', e.target.value === 'admin')}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>}
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={loading || !form.nombre.trim() || !form.email.trim() || !form.password.trim()}
          >
            {loading ? 'Creando...' : 'Crear usuario'}
          </button>
        </div>

      </div>
    </div>
  );
}