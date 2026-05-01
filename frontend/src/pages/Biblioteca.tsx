// Página principal de la Biblioteca de recursos educativos.
// Permite explorar artículos, guías y cuestionarios de ciberseguridad,
// con filtros por tipo de contenido, tema y búsqueda por texto.

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  TIPOS,
  type TipoContenido,
  type Recurso,
} from '../types/biblioteca';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BibSidebar from '../components/biblioteca/BibSidebar';
import FeaturedGrid from '../components/biblioteca/FeaturedGrid';
import ArticlesList from '../components/biblioteca/ArticlesList';
import QuizzesList from '../components/biblioteca/QuizzesList';
import heroBiblioteca from '../assets/images/cyber-library.webp';
import '../styles/biblioteca.css';

/** URL base de la API. Se toma de la variable de entorno o usa producción como fallback. */
const API_BASE =
  import.meta.env.VITE_API_URL ?? 'https://backend-web-ciberseguridad.onrender.com';

/** Estructura de tema consumida por el sidebar. */
type TemaSidebar = {
  id: string;
  label: string;
};

/** Modos de visualización del panel principal. */
type VistaBiblioteca = 'grid' | 'list';

export default function Biblioteca() {
  // Estado de filtros

  /** Tipo de contenido actualmente seleccionado en el sidebar ('all' muestra todos). */
  const [tipoActivo, setTipoActivo] = useState<TipoContenido | 'all'>('all');

  /** Tema actualmente seleccionado en el sidebar ('all' muestra todos los temas). */
  const [temaActivo, setTemaActivo] = useState<string>('all');

  /** Texto ingresado en el buscador del hero para filtrar por título o descripción. */
  const [busqueda, setBusqueda] = useState('');

  /** Controla si el menú mobile del Navbar está abierto o cerrado. */
  const [menuOpen, setMenuOpen] = useState(false);

  /** Modo de visualización del listado principal: cuadrícula o lista. */
  const [vista, setVista] = useState<VistaBiblioteca>('grid');

  /** Cantidad de recursos a mostrar por página. */
  const [filasPorPagina, setFilasPorPagina] = useState<number>(12);

  /** Página actual de la paginación. */
  const [paginaActual, setPaginaActual] = useState<number>(1);

  // Estado de datos remotos

  /** Lista completa de recursos cargados desde la API. */
  const [recursos, setRecursos] = useState<Recurso[]>([]);

  /** Lista de categorías reales cargadas desde el backend para poblar el sidebar. */
  const [temas, setTemas] = useState<TemaSidebar[]>([]);

  /** Indica si hay una petición en curso para mostrar el estado de carga. */
  const [loading, setLoading] = useState<boolean>(false);

  /** Mensaje de error si alguna petición a la API falla; null si no hay error. */
  const [error, setError] = useState<string | null>(null);

  // Fetch de categorías
  /**
   * Carga las categorías reales creadas desde el panel admin.
   * Estas categorías se usan como temas dinámicos en el sidebar.
   */
  useEffect(() => {
    let cancelled = false;

    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE}/categoria/obtener/all/`);
        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data = await response.json();
        const categorias = Array.isArray(data?.result) ? data.result : [];

        const categoriasMapeadas: TemaSidebar[] = categorias
          .map((categoria: any) => ({
            id: String(categoria.nombre ?? '').trim(),
            label: String(categoria.nombre ?? '').trim(),
          }))
          .filter((categoria: TemaSidebar) => categoria.id !== '');

        if (!cancelled) {
          setTemas(categoriasMapeadas);
        }
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        if (!cancelled) {
          setTemas([]);
        }
      }
    };

    fetchCategorias();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch de recursos y cuestionarios
  /**
   * Carga en paralelo:
   * - recursos educativos
   * - cuestionarios
   *
   * Luego unifica ambos resultados en un solo arreglo para que la biblioteca
   * pueda filtrarlos, ordenarlos y paginarlos desde un mismo flujo.
   */
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    /**
     * Obtiene cuestionarios desde la API y los adapta al tipo `Recurso`.
     */
    const fetchCuestionarios = () =>
      fetch(`${API_BASE}/cuestionario/obtener/all/`)
        .then((r) => {
          if (!r.ok) throw new Error(`Error ${r.status}`);
          return r.json();
        })
        .then((data: any) =>
          (Array.isArray(data?.result) ? data.result : []).map(
            (c: any): Recurso => ({
              id: c.cuestionario_id,
              tipo: 'cuestionario',
              tema: c.categoria?.nombre ?? '',
              titulo: c.titulo ?? '',
              descripcion: c.descripcion ?? '',
              esPublico: c.es_activo,
              preguntas: c.preguntas?.length ?? 0,
            })
          )
        );

    /**
     * Obtiene artículos y guías desde el endpoint general de recursos.
     */
    const fetchRecursos = () =>
      fetch(`${API_BASE}/categoria/recurso-edu/obtener/all/`)
        .then((r) => {
          if (!r.ok) throw new Error(`Error ${r.status}`);
          return r.json();
        })
        .then((data: any) =>
          (Array.isArray(data?.result) ? data.result : []).map(
            (r: any): Recurso => ({
              id: r.recurso_id,
              tipo: r.tipo_recurso as TipoContenido,
              tema: r.categoria?.nombre ?? '',
              titulo: r.titulo ?? '',
              descripcion: r.descripcion ?? '',
              urlRecurso: r.url_recurso,
              esPublico: r.es_publico,
              fechaPublicacion: r.fecha_publicacion,
            })
          )
        );

    Promise.all([fetchRecursos(), fetchCuestionarios()])
      .then(([res, quiz]) => {
        if (!cancelled) {
          setRecursos([...res, ...quiz]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? 'Error al cargar recursos');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Filtrado por tipo
  /**
   * Aplica el filtro principal del sidebar:
   * - all
   * - articulo
   * - guia
   * - cuestionario
   */
  const recursosFiltradosPorTipo = useMemo(() => {
    if (tipoActivo === 'all') return recursos;
    return recursos.filter((r) => r.tipo === tipoActivo);
  }, [recursos, tipoActivo]);

  // Filtrado por tema y búsqueda
  /**
   * Aplica filtros secundarios:
   * - categoría/tema
   * - texto ingresado en el buscador
   */
  const filtrados = useMemo(() => {
    return recursosFiltradosPorTipo.filter((r) => {
      if (temaActivo !== 'all' && r.tema !== temaActivo) return false;

      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        return (
          r.titulo.toLowerCase().includes(q) ||
          r.descripcion.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [recursosFiltradosPorTipo, temaActivo, busqueda]);

  // Orden estable del listado
  /**
   * Ordena primero por fecha descendente y, si no existe diferencia,
   * usa el título para mantener un orden estable y predecible.
   */
  const ordenados = useMemo(() => {
    return [...filtrados].sort((a, b) => {
      const fechaA = a.fechaPublicacion ? new Date(a.fechaPublicacion).getTime() : 0;
      const fechaB = b.fechaPublicacion ? new Date(b.fechaPublicacion).getTime() : 0;

      if (fechaB !== fechaA) return fechaB - fechaA;

      return a.titulo.localeCompare(b.titulo, 'es', {
        sensitivity: 'base',
      });
    });
  }, [filtrados]);

  // Paginación
  /**
   * Calcula el total de páginas según el total de resultados y
   * la cantidad seleccionada por página.
   */
  const totalPaginas = useMemo(() => {
    return Math.max(1, Math.ceil(ordenados.length / filasPorPagina));
  }, [ordenados.length, filasPorPagina]);

  /**
   * Reinicia la página actual cuando cambia cualquiera de los filtros principales,
   * la cantidad por página o el modo de vista.
   */
  useEffect(() => {
    setPaginaActual(1);
  }, [tipoActivo, temaActivo, busqueda, filasPorPagina, vista]);

  /**
   * Si por un cambio de filtros la página actual queda fuera de rango,
   * la ajusta al nuevo máximo disponible.
   */
  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  /**
   * Obtiene únicamente los elementos correspondientes a la página actual.
   */
  const recursosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    return ordenados.slice(inicio, fin);
  }, [ordenados, paginaActual, filasPorPagina]);

  // Bloqueo de scroll cuando el menú mobile está abierto
  /**
   * Evita scroll del body mientras el menú mobile del navbar está abierto.
   */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Métricas para el sidebar
  /**
   * Cuenta cuántos recursos pertenecen a cada tema para mostrarlos
   * como badges o contadores en el sidebar.
   */
  const conteoPorTema = useMemo(() => {
    return recursos.reduce<Record<string, number>>((acc, r) => {
      if (!r.tema) return acc;
      acc[r.tema] = (acc[r.tema] ?? 0) + 1;
      return acc;
    }, {});
  }, [recursos]);

  // Temas dinámicos del sidebar
  /**
   * Construye la lista final de temas del sidebar:
   * - parte de las categorías cargadas desde backend,
   * - añade temas presentes en recursos si aún no existen.
   */
  const temasSidebar = useMemo(() => {
    const base = [...temas];
    const existentes = new Set(base.map((t) => t.id));

    recursos.forEach((recurso) => {
      const tema = recurso.tema?.trim();
      if (!tema) return;

      if (!existentes.has(tema)) {
        base.push({
          id: tema,
          label: tema,
        });
        existentes.add(tema);
      }
    });

    return base.sort((a, b) =>
      a.label.localeCompare(b.label, 'es', { sensitivity: 'base' })
    );
  }, [temas, recursos]);

  /**
   * Inserta una opción global para poder volver fácilmente
   * al estado sin filtro de categorías.
   */
  const temasSidebarConTodos = useMemo(() => {
    return [{ id: 'all', label: 'Todas las categorías' }, ...temasSidebar];
  }, [temasSidebar]);

  // Acciones
  /**
   * Limpia filtros secundarios visibles en la UI:
   * - tema
   * - búsqueda
   */
  const limpiarFiltros = () => {
    setTemaActivo('all');
    setBusqueda('');
  };

  /**
   * Avanza una página sin sobrepasar el límite máximo.
   */
  const irPaginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
  };

  /**
   * Retrocede una página sin bajar de la primera.
   */
  const irPaginaAnterior = () => {
    setPaginaActual((prev) => Math.max(prev - 1, 1));
  };

  // Derivados para paneles
  /**
   * Separa los recursos paginados por tipo para reutilizar
   * los componentes ya existentes según la vista seleccionada.
   */
  const articulos = recursosPaginados.filter((r) => r.tipo === 'articulo');
  const guias = recursosPaginados.filter((r) => r.tipo === 'guia');
  const cuestionarios = recursosPaginados.filter((r) => r.tipo === 'cuestionario');

  /** Etiqueta legible del panel actual. */
  const panelLabel =
    tipoActivo === 'all'
      ? 'Todos los recursos'
      : TIPOS.find((t) => t.id === tipoActivo)?.label ?? '';

  /** Etiqueta legible del tema activo. */
  const temaActivoLabel =
    temaActivo === 'all'
      ? 'Todas las categorías'
      : temasSidebar.find((t) => t.id === temaActivo)?.label ?? temaActivo;

  return (
    <div className="biblioteca">
      {/* Barra de navegación principal con soporte para menú mobile */}
      <Navbar
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
        menuOpen={menuOpen}
      />

      <div className="biblioteca__body">
        {/* Sidebar de filtros por tipo y categoría */}
        <BibSidebar
          tipos={TIPOS}
          temas={temasSidebarConTodos}
          tipoActivo={tipoActivo}
          temaActivo={temaActivo}
          conteoPorTema={conteoPorTema}
          onTipoChange={setTipoActivo}
          onTemaChange={setTemaActivo}
        />

        <main className="biblioteca__content">
          {/* Hero principal con imagen, descripción y buscador */}
          <div
            className="biblioteca__hero"
            style={{ backgroundImage: `url(${heroBiblioteca})` }}
          >
            <div className="biblioteca__hero-overlay" />

            <div className="biblioteca__hero-body">
              <h1>
                Aprende a protegerte
                <br />
                <span>en el mundo digital</span>
              </h1>

              <p>
                Artículos, guías y cuestionarios para fortalecer tu conocimiento
                en ciberseguridad.
              </p>

              {/* Campo de búsqueda en tiempo real */}
              <div className="biblioteca__search">
                <Search size={14} className="biblioteca__search-icon" />
                <input
                  type="search"
                  placeholder="Buscar recursos por palabra clave…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="biblioteca__search-input"
                  aria-label="Buscar recursos"
                />
              </div>
            </div>
          </div>

          {/* Contenedor principal de resultados */}
          <div className="biblioteca__section">
            <div className="biblioteca__section-header">
              <div className="biblioteca__section-left">
                <span className="biblioteca__section-label">{panelLabel}</span>
                <h2 className="biblioteca__section-title">{panelLabel}</h2>
              </div>

              <div className="biblioteca__section-right">
                {/* Chip para limpiar el tema activo */}
                {temaActivo !== 'all' && (
                  <button
                    type="button"
                    className="biblioteca__chip"
                    onClick={limpiarFiltros}
                  >
                    {temaActivoLabel}
                    <span className="biblioteca__chip-remove">✕</span>
                  </button>
                )}

                {/* Contador de resultados totales luego de filtros */}
                <span className="biblioteca__result-count">
                  {loading
                    ? '…'
                    : `${ordenados.length} resultado${ordenados.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {/* Toolbar superior: tamaño de página, cambio de vista y paginación */}
            {!loading && !error && ordenados.length > 0 && (
              <div className="biblioteca__toolbar">
                <div className="biblioteca__toolbar-left">
                  {/* Selector de cantidad de elementos por página */}
                  <label
                    className="biblioteca__rows-label"
                    htmlFor="rows-per-page"
                  >
                    Mostrar
                  </label>

                  <select
                    id="rows-per-page"
                    className="biblioteca__rows-select"
                    value={filasPorPagina}
                    onChange={(e) => setFilasPorPagina(Number(e.target.value))}
                  >
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                  </select>

                  <span className="biblioteca__rows-suffix">por página</span>

                  {/* Switch entre vista en cuadrícula y vista en lista */}
                  <div
                    className="biblioteca__view-switch"
                    role="group"
                    aria-label="Cambiar vista"
                  >
                    <button
                      type="button"
                      className={`biblioteca__view-btn ${
                        vista === 'grid' ? 'biblioteca__view-btn--active' : ''
                      }`}
                      onClick={() => setVista('grid')}
                      aria-pressed={vista === 'grid'}
                      title="Vista en cuadrícula"
                    >
                      <LayoutGrid size={16} />
                      <span>Cuadrícula</span>
                    </button>

                    <button
                      type="button"
                      className={`biblioteca__view-btn ${
                        vista === 'list' ? 'biblioteca__view-btn--active' : ''
                      }`}
                      onClick={() => setVista('list')}
                      aria-pressed={vista === 'list'}
                      title="Vista en lista"
                    >
                      <List size={16} />
                      <span>Lista</span>
                    </button>
                  </div>
                </div>

                <div className="biblioteca__toolbar-right">
                  {/* Resumen de paginación */}
                  <span className="biblioteca__page-summary">
                    Página {paginaActual} de {totalPaginas}
                  </span>

                  {/* Flecha anterior estilo admin usando Lucide.
                      Lucide usa currentColor, por eso el color visible se controla desde CSS. */}
                  <button
                    className="page-btn biblioteca__page-btn"
                    onClick={irPaginaAnterior}
                    disabled={paginaActual === 1}
                    aria-label="Página anterior"
                    title="Página anterior"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {/* Indicador de página activa */}
                  <button
                    type="button"
                    className="page-btn page-btn--active biblioteca__page-btn biblioteca__page-btn--active"
                  >
                    {paginaActual}
                  </button>

                  {/* Flecha siguiente estilo admin usando Lucide */}
                  <button
                    className="page-btn biblioteca__page-btn"
                    onClick={irPaginaSiguiente}
                    disabled={paginaActual === totalPaginas}
                    aria-label="Página siguiente"
                    title="Página siguiente"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Estado de carga */}
            {loading && (
              <div className="biblioteca__loading">Cargando recursos…</div>
            )}

            {/* Estado de error */}
            {error && !loading && (
              <div className="biblioteca__error">
                <p>No se pudieron cargar los recursos.</p>
                <small>{error}</small>
              </div>
            )}

            {/* Render de paneles según tipo y modo de vista */}
            {!loading && !error && (
              <>
                {tipoActivo === 'all' && vista === 'grid' && (
                  <FeaturedGrid
                    recursos={recursosPaginados}
                    onLimpiar={limpiarFiltros}
                  />
                )}

                {tipoActivo === 'all' && vista === 'list' && (
                  <ArticlesList
                    recursos={recursosPaginados}
                    onLimpiar={limpiarFiltros}
                  />
                )}

                {tipoActivo === 'articulo' && vista === 'grid' && (
                  <FeaturedGrid recursos={articulos} onLimpiar={limpiarFiltros} />
                )}

                {tipoActivo === 'articulo' && vista === 'list' && (
                  <ArticlesList recursos={articulos} onLimpiar={limpiarFiltros} />
                )}

                {tipoActivo === 'guia' && vista === 'grid' && (
                  <FeaturedGrid recursos={guias} onLimpiar={limpiarFiltros} />
                )}

                {tipoActivo === 'guia' && vista === 'list' && (
                  <ArticlesList recursos={guias} onLimpiar={limpiarFiltros} />
                )}

                {tipoActivo === 'cuestionario' && vista === 'grid' && (
                  <FeaturedGrid
                    recursos={cuestionarios}
                    onLimpiar={limpiarFiltros}
                  />
                )}

                {tipoActivo === 'cuestionario' && vista === 'list' && (
                  <QuizzesList
                    recursos={cuestionarios}
                    onLimpiar={limpiarFiltros}
                  />
                )}
              </>
            )}
          </div>

          {/* Footer principal */}
          <Footer />
        </main>
      </div>
    </div>
  );
}