// Página principal de gestión de usuarios del panel admin.
// Muestra la lista de usuarios con búsqueda, filtro por estado y paginación.
// Permite editar y eliminar usuarios a través de modales.
// Los datos actualmente son mock — al conectar el backend,
// reemplazar MOCK_USERS por un fetch a /api/admin/users/

import { useState, useMemo } from 'react';
import { Pencil, Trash2, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminTable from '../../../components/admin/AdminTable';
import UserEditModal from './UsersEditModal';
import UserDeleteModal from './UserDeleteModal';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  is_active: boolean;
}

// Datos de prueba — reemplazar por fetch al backend
const MOCK_USERS: User[] = [
  { id: 1,  username: 'daniel',   email: 'daniel@email.com',   role: 'user', is_active: true },
  { id: 2,  username: 'ashley',   email: 'ashley@email.com',   role: 'user', is_active: true },
  { id: 3,  username: 'julian',   email: 'julian@email.com',   role: 'user', is_active: true },
  { id: 4,  username: 'maria',    email: 'maria@email.com',    role: 'user', is_active: false },
  { id: 5,  username: 'carlos',   email: 'carlos@email.com',   role: 'user', is_active: false },
  { id: 6,  username: 'lucia',    email: 'lucia@email.com',    role: 'user', is_active: false },
  { id: 7,  username: 'pedro',    email: 'pedro@email.com',    role: 'user', is_active: false },
  { id: 8,  username: 'sofia',    email: 'sofia@email.com',    role: 'user', is_active: false },
  { id: 9,  username: 'andres',   email: 'andres@email.com',   role: 'user', is_active: false },
  { id: 10, username: 'valeria',  email: 'valeria@email.com',  role: 'user', is_active: false },
  { id: 11, username: 'miguel',   email: 'miguel@email.com',   role: 'user', is_active: false },
  { id: 12, username: 'gabriela', email: 'gabriela@email.com', role: 'user', is_active: false },
];

// Opciones disponibles para el selector de filas por página
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function UsersPage() {
  const [users, setUsers]       = useState<User[]>(MOCK_USERS);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [toEdit, setToEdit]     = useState<User | null>(null);   // usuario seleccionado para editar
  const [toDelete, setToDelete] = useState<User | null>(null);  // usuario seleccionado para eliminar
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filtra los usuarios según búsqueda y estado.
  // useMemo evita recalcular en cada render si no cambian las dependencias.
  const filtered = useMemo(() => users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'active' ? u.is_active : !u.is_active;
    return matchSearch && matchFilter;
  }), [users, search, filter]);

  // Cálculos de paginación
  const totalPages  = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated   = filtered.slice((page - 1) * pageSize, page * pageSize);
  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo   = Math.min(page * pageSize, filtered.length);

  // Al buscar o filtrar se reinicia a la página 1
  const handleSearch   = (val: string) => { setSearch(val);        setPage(1); };
  const handleFilter   = (val: string) => { setFilter(val);        setPage(1); };
  const handlePageSize = (val: number) => { setPageSize(val);      setPage(1); };

  // Elimina el usuario del estado local.
  // Al conectar backend: llamar DELETE /api/admin/users/:id/ antes de actualizar el estado.
  const handleDelete = (user: User) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    setToDelete(null);
  };

  // Definición de columnas de la tabla.
  // La columna 'actions' no existe en el objeto User,
  // usa render para inyectar los botones de acción.
  const columns = [
    { key: 'username', label: 'Usuario' },
    { key: 'email',    label: 'Correo'  },
    {
      key: 'is_active',
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

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Usuarios</h1>

      {/* Toolbar: búsqueda + filtro de estado + botón nuevo usuario */}
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

        {/* Filtro por estado: Todos / Activos / Inactivos */}
        <select
          className="filter-select"
          value={filter}
          onChange={e => handleFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        {/* Al conectar backend: este botón abrirá un modal de creación */}
        <button className="btn btn--primary btn--sm">
          <span className="icon-wrap icon-wrap--sm icon-wrap--white"><UserPlus size={14} /></span>
          Nuevo usuario
        </button>
      </div>

      {/* Tabla — recibe solo la página actual de resultados */}
      <AdminTable data={paginated} columns={columns} />

      {/* Paginación: info de resultados + selector de filas + botones de página */}
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

      {/* Modal de edición — se monta solo cuando hay un usuario seleccionado */}
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

      {/* Modal de confirmación de eliminación */}
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