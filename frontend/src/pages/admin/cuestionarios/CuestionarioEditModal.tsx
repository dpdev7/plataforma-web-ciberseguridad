// src/pages/admin/cuestionarios/CuestionarioEditModal.tsx
import { useState } from 'react';
import { X, ClipboardList } from 'lucide-react';
import type { Cuestionario } from '../../../types/adminContent';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

interface Props {
  cuestionario: Cuestionario;
  onClose:      () => void;
  onConfirm:    () => void;
}

export default function CuestionarioEditModal({ cuestionario, onClose, onConfirm }: Props) {
  const [form, setForm] = useState({
    titulo:       cuestionario.titulo,
    descripcion:  cuestionario.descripcion,
    tiempoLimite: cuestionario.tiempoLimite,
    esActivo:     cuestionario.esActivo,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const set = (key: string, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.titulo.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/cuestionario/editar/${cuestionario.id}/`, {
        method:      'PATCH',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo:                form.titulo,
          descripcion:           form.descripcion,
          es_activo:             form.esActivo,
          tiempo_limite_minutos: form.tiempoLimite,
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      onConfirm();
    } catch (e: any) {
      setError(e.message ?? 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--lg" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__header-left">
            <span className="icon-wrap icon-wrap--md">
              <ClipboardList size={16} />
            </span>
            <h2 className="modal__title">Editar cuestionario</h2>
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
            <label>Tiempo límite (minutos) — 0 para sin límite</label>
            <input
              className="form-input"
              type="number"
              min={0}
              value={form.tiempoLimite}
              onChange={e => set('tiempoLimite', Number(e.target.value))}
            />
          </div>

          {/* Slide toggle para es_activo */}
          <div className="form-group form-group--row" style={{ alignItems: 'center', gap: '12px' }}>
            <label style={{ margin: 0 }}>Estado</label>
            <div
              onClick={() => set('esActivo', !form.esActivo)}
              style={{
                width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
                background: form.esActivo ? '#3b82f6' : '#334155',
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: form.esActivo ? '23px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
              }} />
            </div>
            <span style={{ color: form.esActivo ? '#3b82f6' : 'var(--text-dim)', fontSize: '0.85rem' }}>
              {form.esActivo ? 'Activo' : 'Inactivo'}
            </span>
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
            disabled={!form.titulo.trim() || loading}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

      </div>
    </div>
  );
}