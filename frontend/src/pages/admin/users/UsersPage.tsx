import { useState, useMemo, useEffect } from 'react';  // 👈 agregar useEffect
import { Pencil, Trash2, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminTable from '../../../components/admin/AdminTable';
import UserEditModal from './UsersEditModal';
import UserDeleteModal from './UserDeleteModal';

// 👇 Interfaz actualizada para coincidir con el backend
interface User {
  id: string;
  nombre: string;
  email: string;
  es_administrador: boolean;
  activo: boolean;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function UsersPage() {
  const [users, setUsers]       = useState<User[]>([]);  // array vacío, no mock
  const [loading, setLoading]   = useState(true);        
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('active');
  const [toEdit, setToEdit]     = useState<User | null>(null);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 👇 Fetch real al backend
  useEffect(() => {
    fetch("http://localhost:8000/usuario/get/all/", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.result);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => users.filter(u => {
    const matchSearch = u.nombre.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'active' ? u.activo : !u.activo;
    return matchSearch && matchFilter;
  }), [users, search, filter]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated   = filtered.slice((page - 1) * pageSize, page * pageSize);
  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo   = Math.min(page * pageSize, filtered.length);

  const handleSearch   = (val: string) => { setSearch(val);   setPage(1); };
  const handleFilter   = (val: string) => { setFilter(val);   setPage(1); };
  const handlePageSize = (val: number) => { setPageSize(val); setPage(1); };

  const handleDelete = (user: User) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    setToDelete(null);
  };

  // 👇 Columnas actualizadas con los campos reales del backend
  const columns = [
    { key: 'nombre', label: 'Usuario' },   
    { key: 'email',  label: 'Correo'  },
    {
      key: 'es_administrador',       
      label: 'Rol',
      render: (value: unknown) => (
        <span className={`badge badge--${value ? 'admin' : 'user'}`}>
          {value ? 'Admin' : 'Usuario'}
        </span>
      ),
    },
    {
      key: 'activo',                    
      label: 'Estado',
      render: (value: unknown) => (
        <span className={`badge badge--${value ? 'active' : 'inactive'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: unknown, row: User) => (
        <div className="table-actions">
          <button className="btn btn--ghost btn--sm" onClick={() => setToEdit(row)}>
            <span className="icon-wrap icon-wrap--sm"><Pencil size={13} /></span>
            Editar
          </button>
          <button className="btn btn--danger btn--sm" onClick={() => setToDelete(row)}>
            <span className="icon-wrap icon-wrap--sm icon-wrap--danger"><Trash2 size={13} /></span>
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  // 👇 Mostrar loading mientras carga
  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Usuarios</h1>

      <div className="admin-toolbar">
        <div className="search-box">
          <span className="material-symbols-outlined search-box__icon">search</span>
          <input
            type="text"
            placeholder="Buscar por usuario o correo..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="search-box__input"
          />
        </div>

        <select
          className="filter-select"
          value={filter}
          onChange={e => handleFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        <button className="btn btn--primary btn--sm">
          <span className="icon-wrap icon-wrap--sm icon-wrap--white"><UserPlus size={14} /></span>
          Nuevo usuario
        </button>
      </div>

      <AdminTable data={paginated} columns={columns} />

      <div className="pagination">
        <span className="pagination__info">
          Mostrando {showingFrom}–{showingTo} de {filtered.length}
        </span>

        <div className="pagination__controls">
          <div className="page-size">
            <label className="page-size__label">Filas</label>
            <select
              className="filter-select"
              value={pageSize}
              onChange={e => handlePageSize(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="page-buttons">
            <button
              className="page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`page-btn ${page === n ? 'page-btn--active' : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {toEdit && (
        <UserEditModal
          user={toEdit}
          onClose={() => setToEdit(null)}
          onSave={(updated) => {
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
            setToEdit(null);
          }}
        />
      )}

      {toDelete && (
        <UserDeleteModal
          user={toDelete}
          onClose={() => setToDelete(null)}
          onConfirm={() => handleDelete(toDelete)}
        />
      )}
    </div>
  );
}