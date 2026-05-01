import { useState, useMemo, useEffect } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import type { Recurso, TipoRecurso } from '../../../types/adminContent';
import CategoryCreateModal from './CategoryCreateModal';
import CategoryDeleteModal from './CategoryDeleteModal';
import CategoryEditModal   from './CategoryEditModal';
import ContentCreateModal  from './ContentCreateModal';
import ContentEditModal    from './ContentEditModal';
import ContentDeleteModal  from './ContentDeleteModal';

const API_BASE = 'https://backend-web-ciberseguridad.onrender.com';

interface Categoria {
  categoria_id: string;
  nombre: string;
  descripcion: string;
}

export default function ContentPage() {
  const [recursos,          setRecursos]          = useState<Recurso[]>([]);
  const [categorias,        setCategorias]        = useState<Categoria[]>([]);
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState<string | null>(null);
  const [busqueda,          setBusqueda]          = useState('');
  const [filtroTipo,        setFiltroTipo]        = useState<TipoRecurso | 'all'>('all');
  const [showCreate,        setShowCreate]        = useState(false);
  const [toEdit,            setToEdit]            = useState<Recurso | null>(null);
  const [toDelete,          setToDelete]          = useState<Recurso | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryToEdit,    setCategoryToEdit]    = useState<Categoria | null>(null);
  const [categoryToDelete,  setCategoryToDelete]  = useState<Categoria | null>(null);

  const fetchRecursos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/categoria/recurso-edu/obtener/all/`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const mapped: Recurso[] = data.result.map((r: any) => ({
        id:          r.recurso_id,
        titulo:      r.titulo,
        descripcion: r.descripcion ?? '',
        urlRecurso:  r.url_recurso ?? '',
        tipo:        r.tipo_recurso as TipoRecurso,
        categoria:   r.categoria?.nombre ?? '',
        esPublico:   r.es_publico,
      }));
      setRecursos(mapped);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar recursos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res  = await fetch(`${API_BASE}/categoria/obtener/all/`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setCategorias(data.result);
    } catch {}
  };

  useEffect(() => {
    fetchRecursos();
    fetchCategorias();
  }, []);

  const filtrados = useMemo(() => recursos.filter(r => {
    if (filtroTipo !== 'all' && r.tipo !== filtroTipo) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return r.titulo.toLowerCase().includes(q) || r.descripcion.toLowerCase().includes(q);
    }
    return true;
  }), [recursos, busqueda, filtroTipo]);

  const handleCreate = async (data: Omit<Recurso, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/categoria/recurso-edu/crear/`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo:       data.titulo,
          descripcion:  data.descripcion,
          url_recurso:  data.urlRecurso,
          tipo_recurso: data.tipo,
          es_publico:   data.esPublico,
          categoria_id: data.categoria,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchRecursos();
      setShowCreate(false);
    } catch (e: any) { alert(e.message); }
  };

  const handleEdit = async (data: Recurso) => {
    try {
      const res = await fetch(`${API_BASE}/categoria/recurso-edu/editar/${data.id}/`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo:       data.titulo,
          descripcion:  data.descripcion,
          url_recurso:  data.urlRecurso,
          tipo_recurso: data.tipo,
          es_publico:   data.esPublico,
          categoria_id: data.categoria,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchRecursos();
      setToEdit(null);
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      const res = await fetch(`${API_BASE}/categoria/recurso-edu/eliminar/${toDelete.id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchRecursos();
      setToDelete(null);
    } catch (e: any) { alert(e.message); }
  };

  return (
    <>
      <h1 className="admin-page__title">Biblioteca</h1>

      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={15} className="search-box__icon" />
          <input
            className="search-box__input"
            placeholder="Buscar recurso…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value as TipoRecurso | 'all')}
        >
          <option value="all">Todos los tipos</option>
          <option value="articulo">Artículos</option>
          <option value="guia">Guías</option>
        </select>
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
          <button className="btn btn--primary" onClick={() => setShowCreate(true)}>
            + Nuevo recurso
          </button>
          <button className="btn btn--primary" onClick={() => setShowCategoryModal(true)}>
            + Nueva categoría
          </button>
        </div>
      </div>

      {/* ── Tabla recursos ── */}
      <p className="admin-section-label">Recursos educativos</p>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Visibilidad</th>
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
            ) : filtrados.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{r.titulo}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: 2 }}>{r.descripcion}</div>
                </td>
                <td>
                  <span className={`badge ${r.tipo === 'guia' ? 'badge--active' : 'badge--tipo'}`}>
                    {r.tipo === 'guia' ? 'Guía' : 'Artículo'}
                  </span>
                </td>
                <td>{r.categoria}</td>
                <td>
                  <span className={`badge ${r.esPublico ? 'badge--active' : 'badge--inactive'}`}>
                    {r.esPublico ? 'Público' : 'Privado'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn--ghost btn--sm" onClick={() => setToEdit(r)}>
                      <Pencil size={13} /> Editar
                    </button>
                    <button className="btn btn--danger btn--sm" onClick={() => setToDelete(r)}>
                      <Trash2 size={13} /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Tabla categorías ── */}
      <p className="admin-section-label" style={{ marginTop: '30px' }}>Categorías</p>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                  No hay categorías aún
                </td>
              </tr>
            ) : categorias.map(cat => (
              <tr key={cat.categoria_id}>
                <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{cat.nombre}</td>
                <td style={{ color: 'var(--text-dim)' }}>{cat.descripcion}</td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => setCategoryToEdit(cat)}  // 👈 abre CategoryEditModal
                    >
                      <Pencil size={13} /> Editar
                    </button>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => setCategoryToDelete(cat)}
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

      {/* ── Modales ── */}
      {showCreate && (
        <ContentCreateModal onClose={() => setShowCreate(false)} onConfirm={handleCreate} />
      )}
      {toEdit && (
        <ContentEditModal recurso={toEdit} onClose={() => setToEdit(null)} onConfirm={handleEdit} />
      )}
      {toDelete && (
        <ContentDeleteModal recurso={toDelete} onClose={() => setToDelete(null)} onConfirm={handleDelete} />
      )}
      {showCategoryModal && (
        <CategoryCreateModal
          onClose={() => setShowCategoryModal(false)}
          onConfirm={() => { fetchCategorias(); setShowCategoryModal(false); }}
        />
      )}
      {categoryToEdit && (                          // 👈 CategoryEditModal separado
        <CategoryEditModal
          categoria={categoryToEdit}
          onClose={() => setCategoryToEdit(null)}
          onConfirm={() => { fetchCategorias(); setCategoryToEdit(null); }}
        />
      )}
      {categoryToDelete && (
        <CategoryDeleteModal
          categoryName={categoryToDelete.nombre}
          categoryId={categoryToDelete.categoria_id}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={() => { fetchCategorias(); setCategoryToDelete(null); }}
        />
      )}
    </>
  );
}