import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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

const API_BASE =
  import.meta.env.VITE_API_URL ?? 'https://backend-web-ciberseguridad.onrender.com';

type TemaSidebar = {
  id: string;
  label: string;
};

export default function Biblioteca() {
  const [tipoActivo, setTipoActivo] = useState<TipoContenido | 'all'>('all');
  const [temaActivo, setTemaActivo] = useState<string>('all');
  const [busqueda, setBusqueda] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [temas, setTemas] = useState<TemaSidebar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vista, setVista] = useState<'grid' | 'list'>('grid');
  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina, setPorPagina] = useState(9);

  useEffect(() => {
    let cancelled = false;

    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE}/categoria/obtener/all/`);
        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data = await response.json();
        const categorias = Array.isArray(data?.result) ? data.result : [];

        const categoriasMapeadas: TemaSidebar[] = categorias.map((categoria: any) => ({
          id: String(
            categoria.categoria_id ??
              categoria.id ??
              categoria.nombre ??
              crypto.randomUUID()
          ),
          label: String(categoria.nombre ?? 'General'),
        }));

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

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

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
              tema: c.categoria?.nombre ?? c.tema?.nombre ?? c.tema ?? 'general',
              titulo: c.titulo,
              descripcion: c.descripcion ?? '',
              esPublico: c.es_activo,
              preguntas: c.preguntas?.length ?? 0,
            })
          )
        );

    const fetchRecursos = (tipo?: string) =>
      fetch(
        `${API_BASE}/categoria/recurso-edu/obtener/all/${
          tipo ? `?tipo_recurso=${tipo}` : ''
        }`
      )
        .then((r) => {
          if (!r.ok) throw new Error(`Error ${r.status}`);
          return r.json();
        })
        .then((data: any) =>
          (Array.isArray(data?.result) ? data.result : []).map(
            (r: any): Recurso => ({
              id: r.recurso_id,
              tipo: r.tipo_recurso as TipoContenido,
              tema: r.categoria?.nombre ?? 'general',
              titulo: r.titulo,
              descripcion: r.descripcion ?? '',
              urlRecurso: r.url_recurso,
              imagen: r.imagen ?? r.imagen_url ?? null,
              esPublico: r.es_publico,
              fechaPublicacion: r.fecha_publicacion,
              tiempoLectura: r.tiempo_lectura ?? r.tiempoLectura ?? undefined,
            })
          )
        );

    let promise: Promise<Recurso[]>;

    if (tipoActivo === 'all') {
      promise = Promise.all([fetchRecursos(), fetchCuestionarios()]).then(
        ([res, quiz]) => [...res, ...quiz]
      );
    } else if (tipoActivo === 'cuestionario') {
      promise = fetchCuestionarios();
    } else {
      promise = fetchRecursos(tipoActivo);
    }

    promise
      .then((data) => {
        if (!cancelled) setRecursos(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? 'Error al cargar recursos');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tipoActivo]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setPaginaActual(1);
  }, [tipoActivo, temaActivo, busqueda, vista, porPagina]);

  const conteoPorTema = useMemo(
    () =>
      recursos.reduce<Record<string, number>>((acc, r) => {
        acc[r.tema] = (acc[r.tema] ?? 0) + 1;
        return acc;
      }, {}),
    [recursos]
  );

  const temasSidebar = useMemo(() => {
    const base = [...temas];
    const existentes = new Set(base.map((t) => t.id));

    recursos.forEach((recurso) => {
      if (!existentes.has(recurso.tema)) {
        base.push({
          id: recurso.tema,
          label: recurso.tema,
        });
        existentes.add(recurso.tema);
      }
    });

    return base;
  }, [temas, recursos]);

  const filtrados = useMemo(() => {
    return recursos.filter((r) => {
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
  }, [recursos, temaActivo, busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));

  const paginados = useMemo(() => {
    const inicio = (paginaActual - 1) * porPagina;
    const fin = inicio + porPagina;
    return filtrados.slice(inicio, fin);
  }, [filtrados, paginaActual, porPagina]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const panelLabel =
    tipoActivo === 'all'
      ? 'Todos los recursos'
      : TIPOS.find((t) => t.id === tipoActivo)?.label ?? '';

  const temaActivoLabel =
    temasSidebar.find((t) => t.id === temaActivo)?.label ?? temaActivo;

  const limpiarFiltros = () => {
    setTemaActivo('all');
    setBusqueda('');
    setPaginaActual(1);
  };

  const aplicarTipo = (tipo: TipoContenido | 'all') => {
    setTipoActivo(tipo);
    setMenuOpen(false);
  };

  const aplicarTema = (tema: string) => {
    setTemaActivo(tema);
    setMenuOpen(false);
  };

  const renderContenido = () => {
    if (tipoActivo === 'cuestionario') {
      return <QuizzesList recursos={paginados} onLimpiar={limpiarFiltros} />;
    }

    if (vista === 'list') {
      return <ArticlesList recursos={paginados} onLimpiar={limpiarFiltros} />;
    }

    return <FeaturedGrid recursos={paginados} onLimpiar={limpiarFiltros} />;
  };

  const numerosPagina = useMemo(() => {
    const total = totalPaginas;
    const actual = paginaActual;

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (actual <= 3) return [1, 2, 3, 4, 5];
    if (actual >= total - 2) {
      return [total - 4, total - 3, total - 2, total - 1, total];
    }

    return [actual - 2, actual - 1, actual, actual + 1, actual + 2];
  }, [paginaActual, totalPaginas]);

  return (
    <div className="biblioteca">
      <Navbar
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
        menuOpen={menuOpen}
      />

      {menuOpen && (
        <button
          type="button"
          className="biblioteca__mobile-backdrop"
          aria-label="Cerrar filtros"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="biblioteca__body">
        <aside
          className={`biblioteca__sidebar-shell ${
            menuOpen ? 'biblioteca__sidebar-shell--open' : ''
          }`}
        >
          <div className="biblioteca__mobile-sidebar-header">
            <span>Filtros</span>
            <button
              type="button"
              className="biblioteca__mobile-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar filtros"
            >
              <X size={18} />
            </button>
          </div>

          <BibSidebar
            tipos={TIPOS}
            temas={temasSidebar}
            tipoActivo={tipoActivo}
            temaActivo={temaActivo}
            conteoPorTema={conteoPorTema}
            onTipoChange={aplicarTipo}
            onTemaChange={aplicarTema}
          />
        </aside>

        <main className="biblioteca__content">
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

          <div className="biblioteca__section">
            <div className="biblioteca__section-header">
              <div className="biblioteca__section-left">
                <span className="biblioteca__section-label">{panelLabel}</span>
                <h2 className="biblioteca__section-title">{panelLabel}</h2>
              </div>

              <div className="biblioteca__section-right">
                {temaActivo !== 'all' && (
                  <button
                    className="biblioteca__chip"
                    onClick={limpiarFiltros}
                    type="button"
                  >
                    {temaActivoLabel}
                    <span className="biblioteca__chip-remove">✕</span>
                  </button>
                )}

                <span className="biblioteca__result-count">
                  {loading
                    ? '…'
                    : `${filtrados.length} resultado${filtrados.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {!loading && !error && (
              <div className="biblioteca__toolbar">
                <div className="biblioteca__toolbar-left">
                  <button
                    type="button"
                    className="biblioteca__toolbar-filter-btn"
                    onClick={() => setMenuOpen(true)}
                  >
                    <SlidersHorizontal size={16} />
                    <span>Filtros</span>
                  </button>

                  <div className="biblioteca__rows-group">
                    <span className="biblioteca__rows-label">Mostrar</span>

                    <select
                      className="biblioteca__rows-select"
                      value={porPagina}
                      onChange={(e) => setPorPagina(Number(e.target.value))}
                      aria-label="Cantidad de resultados por página"
                    >
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                    </select>

                    <span className="biblioteca__rows-suffix">por página</span>
                  </div>
                </div>

                <div className="biblioteca__toolbar-right">
                  {tipoActivo !== 'cuestionario' && (
                    <div className="biblioteca__view-switch">
                      <button
                        type="button"
                        className={`biblioteca__view-btn ${
                          vista === 'grid' ? 'biblioteca__view-btn--active' : ''
                        }`}
                        onClick={() => setVista('grid')}
                      >
                        <span>Cuadrícula</span>
                      </button>

                      <button
                        type="button"
                        className={`biblioteca__view-btn ${
                          vista === 'list' ? 'biblioteca__view-btn--active' : ''
                        }`}
                        onClick={() => setVista('list')}
                      >
                        <span>Lista</span>
                      </button>
                    </div>
                  )}

                  <div className="biblioteca__desktop-pagination">
                    <span className="biblioteca__page-summary">
                      Página {paginaActual} de {totalPaginas}
                    </span>

                    <button
                      type="button"
                      className="biblioteca__page-btn"
                      disabled={paginaActual === 1}
                      onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                    >
                      ←
                    </button>

                    {numerosPagina.map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`biblioteca__page-btn ${
                          n === paginaActual ? 'biblioteca__page-btn--active' : ''
                        }`}
                        onClick={() => setPaginaActual(n)}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="biblioteca__page-btn"
                      disabled={paginaActual === totalPaginas}
                      onClick={() =>
                        setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                      }
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="biblioteca__loading">Cargando recursos…</div>
            )}

            {error && !loading && (
              <div className="biblioteca__error">
                <p>No se pudieron cargar los recursos.</p>
                <small>{error}</small>
              </div>
            )}

            {!loading && !error && (
              <>
                {renderContenido()}

                {totalPaginas > 1 && (
                  <div className="biblioteca__mobile-pagination">
                    <button
                      type="button"
                      className="biblioteca__mobile-page-btn"
                      disabled={paginaActual === 1}
                      onClick={() =>
                        setPaginaActual((p) => Math.max(1, p - 1))
                      }
                    >
                      ← Anterior
                    </button>

                    <span className="biblioteca__mobile-page-indicator">
                      Página {paginaActual} de {totalPaginas}
                    </span>

                    <button
                      type="button"
                      className="biblioteca__mobile-page-btn"
                      disabled={paginaActual === totalPaginas}
                      onClick={() =>
                        setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                      }
                    >
                      Siguiente →
                    </button>
                  </div>
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