// Página principal de la Biblioteca de recursos educativos.
// Permite explorar artículos, guías y cuestionarios de ciberseguridad,
// con filtros por tipo de contenido, tema y búsqueda por texto.

import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
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

  // Estado de datos remotos

  /** Lista completa de recursos cargados desde la API. */
  const [recursos, setRecursos] = useState<Recurso[]>([]);

  /** Lista de categorías reales cargadas desde el backend para poblar el sidebar. */
  const [temas, setTemas] = useState<TemaSidebar[]>([]);

  /** Indica si hay una petición en curso para mostrar el estado de carga. */
  const [loading, setLoading] = useState(false);

  /** Mensaje de error si alguna petición a la API falla; null si no hay error. */
  const [error, setError] = useState<string | null>(null);

  // Fetch de categorías
  /**
   * Carga las categorías creadas desde admin.
   * Estas reemplazan los temas estáticos que antes venían de mocks o constantes fijas.
   */
  useEffect(() => {
    let cancelled = false;

    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE}/categoria/recurso-edu/obtener/all/`);
        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data = await response.json();
        const categorias = Array.isArray(data?.result) ? data.result : [];

        /**
         * Usamos `nombre` como `id` porque el filtro de tema compara contra
         * `recurso.tema`, y ese valor también será el nombre de la categoría.
         */
        const categoriasMapeadas: TemaSidebar[] = categorias.map((categoria: any) => ({
          id: String(categoria.nombre ?? ''),
          label: String(categoria.nombre ?? ''),
        })).filter((categoria: TemaSidebar) => categoria.id.trim() !== '');

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

    /**
     * Evita actualizar estado si el componente se desmonta
     * antes de que la petición termine.
     */
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch de recursos y cuestionarios
  /**
   * Carga todos los recursos y cuestionarios una sola vez.
   * Como no vamos a depender del backend para filtrar por tipo,
   * el filtrado se hará completamente en frontend.
   */
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    /**
     * Obtiene los cuestionarios y los adapta a la forma `Recurso`
     * para unificarlos con artículos y guías en una sola lista.
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
              titulo: c.titulo,
              descripcion: c.descripcion ?? '',
              esPublico: c.es_activo,
              preguntas: c.preguntas?.length ?? 0,
            })
          )
        );

    /**
     * Obtiene todos los recursos educativos sin filtrar por tipo en backend.
     * Luego el frontend se encarga de separarlos por artículo, guía, etc.
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
              titulo: r.titulo,
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

    /**
     * Limpieza para evitar race conditions o intentos de setState
     * sobre un componente desmontado.
     */
    return () => {
      cancelled = true;
    };
  }, []);

  // Filtrado por tipo
  /**
   * Filtra primero por tipo de contenido.
   * Si el usuario está en "all", se conserva la lista completa.
   */
  const recursosFiltradosPorTipo = useMemo(() => {
    if (tipoActivo === 'all') return recursos;
    return recursos.filter((r) => r.tipo === tipoActivo);
  }, [recursos, tipoActivo]);

  // Filtrado por tema y búsqueda
  /**
   * Aplica sobre la lista ya filtrada por tipo:
   * - filtro por tema/categoría
   * - búsqueda por título o descripción
   *
   * useMemo evita recalcular esta lista en renders no relacionados.
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

  // Bloqueo de scroll cuando el menú mobile está abierto
  /**
   * Bloquea el scroll del body mientras el menú mobile está abierto,
   * para evitar que el fondo se desplace detrás del overlay del menú.
   */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Métricas para el sidebar
  /**
   * Cuenta cuántos recursos pertenecen a cada tema.
   * Esto alimenta los badges o contadores visibles en el sidebar.
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
   * Parte de las categorías del backend y además agrega cualquier tema que
   * ya venga presente en los recursos pero no haya aparecido en el endpoint
   * de categorías.
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

    return base;
  }, [temas, recursos]);

  /** Lista final para mostrar en sidebar, incluyendo la opción raíz. */
  const temasSidebarConTodos = useMemo(() => {
    return [
      { id: 'all', label: 'Todas las categorías' },
      ...temasSidebar,
    ];
  }, [temasSidebar]);

  // Acciones
  /** Restablece el filtro de tema y el texto de búsqueda a sus valores iniciales. */
  const limpiarFiltros = () => {
    setTemaActivo('all');
    setBusqueda('');
  };

  // Derivados para los paneles de contenido
  /** Separa los recursos filtrados por tipo para pasarlos a cada componente visual. */
  const articulos = filtrados.filter((r) => r.tipo === 'articulo');
  const guias = filtrados.filter((r) => r.tipo === 'guia');
  const cuestionarios = filtrados.filter((r) => r.tipo === 'cuestionario');

  /** Etiqueta legible del tipo activo para mostrar en el encabezado de la sección. */
  const panelLabel =
    tipoActivo === 'all'
      ? 'Todos los recursos'
      : TIPOS.find((t) => t.id === tipoActivo)?.label ?? '';

  /** Etiqueta del tema activo para mostrar en el chip de filtro. */
  const temaActivoLabel =
    temaActivo === 'all'
      ? 'Todas las categorías'
      : temasSidebar.find((t) => t.id === temaActivo)?.label ?? temaActivo;

  // Render
  return (
    <div className="biblioteca">
      {/* Barra de navegación principal con soporte para menú mobile */}
      <Navbar
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
        menuOpen={menuOpen}
      />

      <div className="biblioteca__body">
        {/* Sidebar con filtros de tipo y categorías dinámicas */}
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
          {/* Hero — sección destacada con imagen de fondo, título y buscador principal */}
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
                Artículos, guías y cuestionarios para fortalecer tu conocimiento en ciberseguridad.
              </p>

              {/* Campo de búsqueda: filtra recursos por título y descripción en tiempo real */}
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

          {/* Sección principal de resultados */}
          <div className="biblioteca__section">
            <div className="biblioteca__section-header">
              <div className="biblioteca__section-left">
                <span className="biblioteca__section-label">{panelLabel}</span>
                <h2 className="biblioteca__section-title">{panelLabel}</h2>
              </div>

              <div className="biblioteca__section-right">
                {/* Chip del tema activo: permite quitar el filtro con un clic */}
                {temaActivo !== 'all' && (
                  <button className="biblioteca__chip" onClick={limpiarFiltros}>
                    {temaActivoLabel}
                    <span className="biblioteca__chip-remove">✕</span>
                  </button>
                )}

                {/* Contador de resultados; muestra '…' durante la carga */}
                <span className="biblioteca__result-count">
                  {loading
                    ? '…'
                    : `${filtrados.length} resultado${filtrados.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {/* Estado de carga mientras se resuelven las peticiones a la API */}
            {loading && <div className="biblioteca__loading">Cargando recursos…</div>}

            {/* Mensaje de error si la carga falló */}
            {error && !loading && (
              <div className="biblioteca__error">
                <p>No se pudieron cargar los recursos.</p>
                <small>{error}</small>
              </div>
            )}

            {/* Paneles de contenido según el tipo activo */}
            {!loading && !error && (
              <>
                {tipoActivo === 'all' && (
                  <FeaturedGrid recursos={filtrados} onLimpiar={limpiarFiltros} />
                )}

                {tipoActivo === 'articulo' && (
                  <ArticlesList recursos={articulos} onLimpiar={limpiarFiltros} />
                )}

                {tipoActivo === 'guia' && (
                  <FeaturedGrid recursos={guias} onLimpiar={limpiarFiltros} />
                )}

                {tipoActivo === 'cuestionario' && (
                  <QuizzesList recursos={cuestionarios} onLimpiar={limpiarFiltros} />
                )}
              </>
            )}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}