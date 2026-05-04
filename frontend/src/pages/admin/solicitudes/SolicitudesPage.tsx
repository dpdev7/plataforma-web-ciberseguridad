import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { apiFetch } from '../../../utils/api';

interface Solicitud {
  solicitud_id: string;
  usuario_id:   string;
  nombre:       string;
  email:        string;
  motivo:       string;
  descripcion:  string;
  estado:       string;
  fecha:        string;
}

const MOTIVO_LABEL: Record<string, string> = {
  no_uso:        'Ya no uso la plataforma',
  problemas_tec: 'Problemas técnicos',
  privacidad:    'Privacidad',
  otro:          'Otro',
};

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [confirmar,   setConfirmar]   = useState<Solicitud | null>(null);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/solicitud/all/');
      if (data.success) setSolicitudes(data.result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSolicitudes(); }, []);

  const handleRechazar = async (solicitud: Solicitud) => {
    try {
      const data = await apiFetch(`/solicitud/rechazar/${solicitud.solicitud_id}/`, {
        method: 'PATCH',
      });
      if (data.success) {
        alert(`Solicitud de ${solicitud.nombre} rechazada. Se notificó al usuario.`);
        fetchSolicitudes();
      }
    } catch {
      alert('Error al rechazar la solicitud');
    }
  };

  const handleAceptar = async () => {
    if (!confirmar) return;
    try {
      const data = await apiFetch(`/solicitud/aceptar/${confirmar.solicitud_id}/`, {
        method: 'PATCH',
      });
      if (data.success) {
        alert(`Cuenta de ${confirmar.nombre} eliminada correctamente.`);
        setConfirmar(null);
        fetchSolicitudes();
      }
    } catch {
      alert('Error al aceptar la solicitud');
    }
  };

  return (
    <>
      <h1 className="admin-page__title">Solicitudes de eliminación</h1>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Motivo</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>Cargando…</td></tr>
            ) : solicitudes.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>No hay solicitudes pendientes</td></tr>
            ) : solicitudes.map(s => (
              <tr key={s.solicitud_id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{s.nombre}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{s.email}</div>
                </td>
                <td>{MOTIVO_LABEL[s.motivo] ?? s.motivo}</td>
                <td>
                  <div style={{
                    maxWidth: '250px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    color: 'var(--text-dim)',
                    fontSize: '13px',
                  }}>
                    {s.descripcion || '—'}
                  </div>
                </td>
                <td style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                  {new Date(s.fecha).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => handleRechazar(s)}
                    >
                      <X size={13} /> Rechazar
                    </button>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => setConfirmar(s)}
                    >
                      <Check size={13} /> Aceptar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal confirmación aceptar */}
      {confirmar && (
        <div className="modal-overlay" onClick={() => setConfirmar(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Confirmar eliminación</h2>
              <button className="modal__close" onClick={() => setConfirmar(null)}><X size={18} /></button>
            </div>
            <div className="modal__body">
              <p className="delete-confirm__text">
                ¿Estás seguro que deseas eliminar la cuenta de{' '}
                <strong>{confirmar.nombre}</strong>? Esta acción no se puede deshacer.
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '8px' }}>
                {confirmar.email}
              </p>
            </div>
            <div className="modal__footer">
              <button className="btn btn--ghost" onClick={() => setConfirmar(null)}>Cancelar</button>
              <button className="btn btn--danger" onClick={handleAceptar}>Sí, eliminar cuenta</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}