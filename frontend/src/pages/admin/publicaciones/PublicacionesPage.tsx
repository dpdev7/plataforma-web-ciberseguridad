import { useState, useEffect } from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../../../utils/api';

interface Publicacion {
  publicacion_id: string;
  titulo:         string;
  contenido:      string;
  es_anonima:     boolean;
  fecha_creacion: string;
  editada:        boolean;
  usuario:        { usuario_id: string; nombre: string } | null;
  comentarios:    { comentario_id: string }[];
}

function TituloCell({ titulo }: { titulo: string }) {
  const [expandido, setExpandido] = useState(false);
  const MAX = 60;
  const corto = titulo.length > MAX;
  return (
    <div style={{ maxWidth: '280px', fontSize: '13px', color: '#f1f5f9', fontWeight: 600 }}>
      {expandido || !corto ? titulo : `${titulo.slice(0, MAX)}...`}
      {corto && (
        <button onClick={() => setExpandido(p => !p)} style={{
          display: 'block', marginTop: '2px', background: 'transparent',
          border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '11px', padding: 0,
        }}>
          {expandido ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  );
}

export default function PublicacionesPage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [confirmar,     setConfirmar]     = useState<Publicacion | null>(null);
  const [eliminando,    setEliminando]    = useState(false);
  const [busqueda,      setBusqueda]      = useState('');

  const fetchPublicaciones = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/publicacion/all/');
      if (data.success) {
        setPublicaciones(
          Array.isArray(data.result)
            ? data.result.map((p: Publicacion) => ({
                ...p,
                comentarios: p.comentarios ?? [],
              }))
            : []
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPublicaciones(); }, []);

  const handleEliminar = async () => {
    if (!confirmar) return;
    setEliminando(true);
    try {
      const data = await apiFetch(
        `/publicacion/eliminar/${confirmar.publicacion_id}/`,
        { method: 'DELETE' }
      );
      if (data.success) {
        setPublicaciones(prev =>
          prev.filter(p => p.publicacion_id !== confirmar.publicacion_id)
        );
        setConfirmar(null);
      } else {
        alert(data.message || 'Error al eliminar la publicación');
      }
    } catch {
      alert('Error de conexión');
    } finally {
      setEliminando(false);
    }
  };

  const filtradas = publicaciones.filter(p =>
    p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.usuario?.nombre ?? '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <h1 className="admin-page__title">Publicaciones del Foro</h1>

      {/* Buscador */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Buscar por título o autor..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            background: '#111c27', border: '1px solid #2b333e',
            color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px',
            width: '100%', maxWidth: '360px', fontSize: '13px',
            outline: 'none',
          }}
        />
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Comentarios</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                  Cargando…
                </td>
              </tr>
            ) : filtradas.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                  No hay publicaciones
                </td>
              </tr>
            ) : filtradas.map(p => (
              <tr key={p.publicacion_id}>
                <td><TituloCell titulo={p.titulo} /></td>
                <td>
                  {p.es_anonima ? (
                    <span style={{ color: 'var(--text-dim)', fontSize: '13px', fontStyle: 'italic' }}>
                      Anónimo
                    </span>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '13px' }}>
                        {p.usuario?.nombre ?? '—'}
                      </div>
                    </div>
                  )}
                </td>
                <td style={{ fontSize: '13px', color: 'var(--text-dim)', textAlign: 'center' }}>
                  {p.comentarios.length}
                </td>
                <td style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                  {new Date(p.fecha_creacion).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                  {p.editada && (
                    <span style={{ marginLeft: '6px', fontSize: '11px', color: '#d29922' }}>
                      editado
                    </span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => setConfirmar(p)}
                    >
                      <Trash2 size={13} /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal confirmación */}
      {confirmar && (
        <div className="modal-overlay" onClick={() => !eliminando && setConfirmar(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Eliminar publicación</h2>
              <button
                className="modal__close"
                onClick={() => setConfirmar(null)}
                disabled={eliminando}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal__body">
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                background: 'rgba(231,68,68,0.08)', border: '1px solid rgba(231,68,68,0.25)',
                borderRadius: '8px', padding: '14px', marginBottom: '16px',
              }}>
                <AlertTriangle size={18} color="#e74444" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '13px', color: '#f1f5f9', margin: 0, lineHeight: 1.6 }}>
                  Esta acción eliminará permanentemente la publicación y{' '}
                  <strong>todos sus comentarios ({confirmar.comentarios.length})</strong>.
                  No se puede deshacer.
                </p>
              </div>
              <p style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: 600, marginBottom: '4px' }}>
                "{confirmar.titulo}"
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                Autor: {confirmar.es_anonima ? 'Anónimo' : (confirmar.usuario?.nombre ?? '—')}
              </p>
            </div>
            <div className="modal__footer">
              <button
                className="btn btn--ghost"
                onClick={() => setConfirmar(null)}
                disabled={eliminando}
              >
                Cancelar
              </button>
              <button
                className="btn btn--danger"
                onClick={handleEliminar}
                disabled={eliminando}
                style={{ opacity: eliminando ? 0.7 : 1 }}
              >
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}