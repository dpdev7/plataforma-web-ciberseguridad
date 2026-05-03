import { useState, useMemo, useEffect } from 'react';
import { Pencil, Trash2, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminTable      from '../../../components/admin/AdminTable';
import UserEditModal   from './UsersEditModal';
import UserDeleteModal from './UserDeleteModal';
import UserCreateModal from './UserCreateModal';
import { API_BACKEND } from '../../../utils/api';


interface User {
  id: string;
  nombre: string;
  email: string;
  es_administrador: boolean;
  activo: boolean;
}


const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];


export default function UsersPage() {
  const [users,      setUsers]      = useState<User[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('active');
  const [toEdit,     setToEdit]     = useState<User | null>(null);
  const [toDelete,   setToDelete]   = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [page,       setPage]       = useState(1);
  const [pageSize,   setPageSize]   = useState(5);


  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_BACKEND}/usuario/get/all/`, { credentials: "include" })
      .then(res => res.json())
      .then(data => { if (data.success) setUsers(data.result); })
      .finally(() => setLoading(false));
  };


  useEffect(() => { fetchUsers(); }, []);


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


  // Genera una lista corta de páginas para evitar demasiados botones en pantallas pequeñas.
  // En mobile muestra máx. 5 páginas centradas en la página actual; en desktop hasta 7.
  const visiblePages = useMemo(() => {
    const maxVisible = typeof window !== 'undefined' && window.innerWidth < 768 ? 5 : 7;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end   = start + maxVisible - 1;
    if (end > totalPages) { end = totalPages; start = Math.max(1, end - maxVisible + 1); }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);


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

        <button
          className="btn btn--primary btn--sm"
          onClick={() => setShowCreate(true)}
        >
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

            {/* Usa visiblePages en vez de todos los números para evitar
                desbordamiento en pantallas pequeñas con muchas páginas. */}
            {visiblePages.map(n => (
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


      {showCreate && (
        <UserCreateModal
          onClose={() => setShowCreate(false)}
          onConfirm={() => { fetchUsers(); setShowCreate(false); }}
        />
      )}

      {toEdit && (
        <UserEditModal
          user={toEdit}
          onClose={() => setToEdit(null)}
          onSave={() => { fetchUsers(); setToEdit(null); }}
        />
      )}

      {toDelete && (
        <UserDeleteModal
          user={toDelete}
          onClose={() => setToDelete(null)}
          onConfirm={() => { fetchUsers(); setToDelete(null); }}
        />
      )}
    </div>
  );
}