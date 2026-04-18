import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Trash2, ListChecks } from 'lucide-react';
import type { Cuestionario } from '../../../types/adminContent';
import CuestionarioCreateModal    from './CuestionarioCreateModal';
import CuestionarioEditModal      from './CuestionarioEditModal';
import CuestionarioDeleteModal    from './CuestionarioDeleteModal';
import CuestionarioPreguntasModal from './CuestionarioPreguntasModal';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export default function CuestionariosPage() {
  const [cuestionarios, setCuestionarios] = useState<Cuestionario[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [busqueda,      setBusqueda]      = useState('');
  const [filtroEstado,  setFiltroEstado]  = useState<'all' | 'activo' | 'inactivo'>('all');

  const [showCreate,  setShowCreate]  = useState(false);
  const [toEdit,      setToEdit]      = useState<Cuestionario | null>(null);
  const [toDelete,    setToDelete]    = useState<Cuestionario | null>(null);
  const [toPreguntas, setToPreguntas] = useState<Cuestionario | null>(null);

  const fetchCuestionarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/cuestionario/obtener/all/`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const mapped: Cuestionario[] = data.result.map((c: any) => ({
        id:             c.cuestionario_id,
        titulo:         c.titulo,
        descripcion:    c.descripcion ?? '',
        tiempoLimite:   c.tiempo_limite_minutos ?? 0,
        esActivo:       c.es_activo,
        totalPreguntas: c.preguntas?.length ?? 0,
      }));
      setCuestionarios(mapped);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCuestionarios(); }, []);

  const filtrados = useMemo(() => cuestionarios.filter(c => {
    if (filtroEstado === 'activo'   && !c.esActivo) return false;
    if (filtroEstado === 'inactivo' &&  c.esActivo) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return c.titulo.toLowerCase().includes(q) || c.descripcion.toLowerCase().includes(q);
    }
    return true;
  }), [cuestionarios, busqueda, filtroEstado]);

  const handleCreate = async (data: Omit<Cuestionario, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/cuestionario/crear/`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo:                data.titulo,
          descripcion:           data.descripcion,
          tiempo_limite_minutos: data.tiempoLimite,
          es_activo:             data.esActivo,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchCuestionarios();
      setShowCreate(false);
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      const res = await fetch(`${API_BASE}/cuestionario/eliminar/${toDelete.id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchCuestionarios();
      setToDelete(null);
    } catch (e: any) { alert(e.message); }
  };

  const total = (c: Cuestionario) => c.totalPreguntas ?? 0;

  return (
    <>
      <h1 className="admin-page__title">Cuestionarios</h1>

      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={15} className="search-box__icon" />
          <input className="search-box__input" placeholder="Buscar cuestionario…"
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <select className="filter-select" value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value as 'all' | 'activo' | 'inactivo')}>
          <option value="all">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
        <button className="btn btn--primary" onClick={() => setShowCreate(true)}>
          <Plus size={15} /> Nuevo cuestionario
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Preguntas</th>
              <th>Tiempo límite</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>Cargando…</td></tr>
            ) : error ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#fca5a5' }}>{error}</td></tr>
            ) : filtrados.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>Sin resultados</td></tr>
            ) : filtrados.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{c.titulo}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: 2 }}>{c.descripcion}</div>
                </td>
                <td>{total(c)} pregunta{total(c) !== 1 ? 's' : ''}</td>
                <td>{c.tiempoLimite === 0 ? 'Sin límite' : `${c.tiempoLimite} min`}</td>
                <td>
                  <span className={`badge ${c.esActivo ? 'badge--active' : 'badge--inactive'}`}>
                    {c.esActivo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn--ghost btn--sm" onClick={() => setToPreguntas(c)}>
                      <ListChecks size={13} /> Preguntas
                    </button>
                    <button className="btn btn--danger btn--sm" onClick={() => setToDelete(c)}>
                      <Trash2 size={13} /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CuestionarioCreateModal
          onClose={() => setShowCreate(false)}
          onConfirm={handleCreate}
        />
      )}
      {toEdit && (
        <CuestionarioEditModal
          cuestionario={toEdit}
          onClose={() => setToEdit(null)}
          onConfirm={async () => { setToEdit(null); await fetchCuestionarios(); }}
        />
      )}
      {toDelete && (
        <CuestionarioDeleteModal
          cuestionario={toDelete}
          onClose={() => setToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
      {toPreguntas && (
        <CuestionarioPreguntasModal
          cuestionarioId={toPreguntas.id}
          cuestionarioTitulo={toPreguntas.titulo}
          onClose={() => { setToPreguntas(null); fetchCuestionarios(); }}
        />
      )}
    </>
  );
}