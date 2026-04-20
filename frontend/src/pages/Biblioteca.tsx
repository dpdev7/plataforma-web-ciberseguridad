// Página principal de la Biblioteca de recursos educativos.
// Permite explorar artículos, guías y cuestionarios de ciberseguridad,
// con filtros por tipo de contenido, tema y búsqueda por texto.

import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import {
  TEMAS, TIPOS,
  type TipoContenido,
  type Recurso,
} from '../types/biblioteca';
import Navbar        from '../components/common/Navbar';
import Footer        from '../components/common/Footer';
import BibSidebar    from '../components/biblioteca/BibSidebar';
import FeaturedGrid  from '../components/biblioteca/FeaturedGrid';
import ArticlesList  from '../components/biblioteca/ArticlesList';
import QuizzesList   from '../components/biblioteca/QuizzesList';
import heroBiblioteca from '../assets/images/cyber-library.webp';
import '../styles/biblioteca.css';

/** URL base de la API. Se toma de la variable de entorno o usa localhost como fallback en desarrollo. */
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

/** Datos mock para preview visual mientras el backend no está conectado.
 *  Cambiar USE_MOCK a false y BACKEND_READY a true cuando el backend esté listo. */
const BACKEND_READY = true;
const USE_MOCK      = false;

const MOCK_RECURSOS: Recurso[] = [
  {
    id: 'mock-1', tipo: 'guia', tema: 'redes',
    titulo: 'Guía Completa para Principiantes',
    descripcion: 'Aprende los fundamentos de la ciberseguridad y cómo protegerte en línea.',
    tiempoLectura: 12,
    imagen: 'https://picsum.photos/seed/c1/1000/400',
    esPublico: true,
  },
  {
    id: 'mock-2', tipo: 'articulo', tema: 'datos',
    titulo: 'Cómo Cifrar tus Archivos Sensibles',
    descripcion: 'Cifrado nativo en Windows y Mac paso a paso.',
    tiempoLectura: 8,
    imagen: 'https://picsum.photos/seed/a6/500/220',
    esPublico: true,
  },
  {
    id: 'mock-3', tipo: 'articulo', tema: 'acceso',
    titulo: 'La Importancia de las Contraseñas Fuertes',
    descripcion: 'Crea y gestiona contraseñas seguras eficientemente.',
    tiempoLectura: 6,
    imagen: 'https://picsum.photos/seed/a2/500/220',
    esPublico: true,
  },
  {
    id: 'mock-4', tipo: 'articulo', tema: 'cripto',
    titulo: 'AES vs RSA: ¿Cuándo Usar Cada Algoritmo?',
    descripcion: 'Comparativa práctica de cifrado simétrico y asimétrico.',
    tiempoLectura: 7,
    imagen: 'https://picsum.photos/seed/a5/500/220',
    esPublico: true,
  },
  {
    id: 'mock-5', tipo: 'articulo', tema: 'usuario',
    titulo: 'Phishing: Cómo Identificar Correos Sospechosos',
    descripcion: 'Guía para reconocer correos maliciosos y evitar estafas.',
    tiempoLectura: 5,
    imagen: 'https://picsum.photos/seed/a1/500/220',
    esPublico: true,
  },
  {
    id: 'mock-6', tipo: 'articulo', tema: 'amenazas',
    titulo: 'Ransomware: Qué Es y Cómo Prevenirlo',
    descripcion: 'Estrategias de prevención contra el ransomware moderno.',
    tiempoLectura: 10,
    imagen: 'https://picsum.photos/seed/a3/500/220',
    esPublico: true,
  },
  {
    id: 'mock-7', tipo: 'articulo', tema: 'redes',
    titulo: 'VPN: ¿Realmente Protegen tu Privacidad?',
    descripcion: 'Análisis crítico de VPNs y sus limitaciones reales.',
    tiempoLectura: 9,
    imagen: 'https://picsum.photos/seed/a4/500/220',
    esPublico: true,
  },
  {
    id: 'mock-8', tipo: 'guia', tema: 'acceso',
    titulo: 'Gestión Segura de Contraseñas',
    descripcion: 'Gestores de contraseñas y políticas de seguridad personal.',
    tiempoLectura: 15,
    imagen: 'https://picsum.photos/seed/g2/500/220',
    esPublico: true,
  },
  {
    id: 'mock-9', tipo: 'guia', tema: 'redes',
    titulo: 'Hardening de Redes Domésticas',
    descripcion: 'Técnicas avanzadas para fortalecer tu red Wi-Fi.',
    tiempoLectura: 20,
    imagen: 'https://picsum.photos/seed/g3/500/220',
    esPublico: true,
  },
  {
    id: 'mock-10', tipo: 'cuestionario', tema: 'acceso',
    titulo: '¿Qué tan segura es tu contraseña?',
    descripcion: 'Pon a prueba tus conocimientos sobre autenticación.',
    preguntas: 10,
    esPublico: true,
  },
  {
    id: 'mock-11', tipo: 'cuestionario', tema: 'usuario',
    titulo: 'Reconoce Ataques de Phishing',
    descripcion: 'Identifica correos maliciosos en situaciones simuladas.',
    preguntas: 15,
    esPublico: true,
  },
  {
    id: 'mock-12', tipo: 'cuestionario', tema: 'cripto',
    titulo: 'Fundamentos de Criptografía',
    descripcion: 'Hashing, cifrado simétrico, asimétrico y firmas digitales.',
    preguntas: 12,
    esPublico: true,
  },
  {
    id: 'mock-13', tipo: 'cuestionario', tema: 'amenazas',
    titulo: '¿Conoces los Tipos de Malware?',
    descripcion: 'Virus, troyanos, spyware: identifica cada amenaza.',
    preguntas: 10,
    esPublico: true,
  },
];


export default function Biblioteca() {
  // ── Estado de filtros ─────────────────────────────────────────────────────

  /** Tipo de contenido actualmente seleccionado en el sidebar ('all' muestra todos). */
  const [tipoActivo, setTipoActivo] = useState<TipoContenido | 'all'>('all');

  /** Tema actualmente seleccionado en el sidebar ('all' muestra todos los temas). */
  const [temaActivo, setTemaActivo] = useState<string>('all');

  /** Texto ingresado en el buscador del hero para filtrar por título o descripción. */
  const [busqueda, setBusqueda] = useState('');

  /** Controla si el menú mobile del Navbar está abierto o cerrado. */
  const [menuOpen, setMenuOpen] = useState(false);


  // ── Estado de datos remotos ───────────────────────────────────────────────

  /** Lista de recursos cargados desde la API (artículos, guías y cuestionarios). */
  const [recursos, setRecursos] = useState<Recurso[]>([]);

  /** Indica si hay una petición en curso para mostrar el estado de carga. */
  const [loading, setLoading] = useState(false);

  /** Mensaje de error si alguna petición a la API falla; null si no hay error. */
  const [error, setError] = useState<string | null>(null);


  // ── Fetch de recursos ─────────────────────────────────────────────────────
  /**
   * Efecto que se ejecuta cada vez que cambia el tipo de contenido activo.
   * - Mock activo (USE_MOCK): carga datos locales sin fetch.
   * - Backend activo (BACKEND_READY): realiza peticiones a la API según el tipo:
   *   · 'all'          → recursos + cuestionarios en paralelo
   *   · 'cuestionario' → solo cuestionarios del endpoint de categoría
   *   · otro tipo      → recursos filtrados por tipo_recurso en query param
   *
   * Usa la bandera `cancelled` para evitar actualizar el estado si el
   * componente se desmontó o el efecto se limpió antes de resolver la promesa
   * (race condition al cambiar filtros rápidamente).
   */
  useEffect(() => {
    // ── Mock — filtra localmente sin fetch ──────────────────────────────────
    if (USE_MOCK) {
      const filtrados = MOCK_RECURSOS.filter(r => {
        if (tipoActivo !== 'all' && r.tipo !== tipoActivo) return false;
        if (temaActivo !== 'all' && r.tema !== temaActivo) return false;
        if (busqueda.trim()) {
          const q = busqueda.toLowerCase();
          return r.titulo.toLowerCase().includes(q) || r.descripcion.toLowerCase().includes(q);
        }
        return true;
      });
      setRecursos(filtrados);
      return;
    }

    // ── Backend real ────────────────────────────────────────────────────────
    if (!BACKEND_READY) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    /**
     * Obtiene los cuestionarios educativos desde el endpoint de categorías.
     * Mapea la respuesta al tipo `Recurso` normalizado.
     */
    const fetchCuestionarios = () =>
      fetch(`${API_BASE}/categoria/recurso-edu/obtener/all/`)
        .then(r => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json(); })
        .then((data: any) => data.result.map((c: any): Recurso => ({
          id:          c.cuestionario_id,
          tipo:        'cuestionario',
          tema:        'general',
          titulo:      c.titulo,
          descripcion: c.descripcion ?? '',
          esPublico:   c.es_activo,
          preguntas:   c.preguntas?.length ?? 0,
        })));

    /**
     * Obtiene recursos (artículos, guías, etc.) desde el endpoint general.
     * Acepta un `tipo` opcional para filtrar por tipo_recurso en la query.
     * Mapea la respuesta al tipo `Recurso` normalizado.
     */
    const fetchRecursos = (tipo?: string) =>
      fetch(`${API_BASE}/categoria/recurso-edu/obtener/all/${tipo ? `?tipo_recurso=${tipo}` : ''}`)
        .then(r => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json(); })
        .then((data: any) => data.result.map((r: any): Recurso => ({
          id:               r.recurso_id,
          tipo:             r.tipo_recurso as TipoContenido,
          tema:             r.categoria?.nombre ?? 'general',
          titulo:           r.titulo,
          descripcion:      r.descripcion ?? '',
          urlRecurso:       r.url_recurso,
          esPublico:        r.es_publico,
          fechaPublicacion: r.fecha_publicacion,
        })));

    let promise: Promise<Recurso[]>;

    // Determina qué endpoints llamar según el filtro de tipo activo
    if (tipoActivo === 'all') {
      // Carga ambas fuentes en paralelo y las combina en un solo array
      promise = Promise.all([fetchRecursos(), fetchCuestionarios()])
        .then(([res, quiz]) => [...res, ...quiz]);
    } else if (tipoActivo === 'cuestionario') {
      promise = fetchCuestionarios();
    } else {
      // Para artículos, guías u otros tipos, pasa el tipo como query param
      promise = fetchRecursos(tipoActivo);
    }

    promise
      .then(data => { if (!cancelled) setRecursos(data); })
      .catch(err  => { if (!cancelled) setError(err.message ?? 'Error al cargar recursos'); })
      .finally(()  => { if (!cancelled) setLoading(false); });

    // Función de limpieza: cancela la actualización de estado si el efecto
    // se re-ejecuta antes de que la promesa anterior haya resuelto
    return () => { cancelled = true; };
  }, [tipoActivo]); // Solo re-ejecuta al cambiar el tipo de contenido


  // ── Filtrado derivado ─────────────────────────────────────────────────────
  /**
   * Lista de recursos filtrados por tema y texto de búsqueda.
   * Se recalcula solo cuando cambian `recursos`, `temaActivo` o `busqueda`,
   * evitando iteraciones innecesarias en cada render gracias a `useMemo`.
   */
  const filtrados = useMemo(() => recursos.filter(r => {
    // Descarta recursos cuyo tema no coincida con el filtro activo
    if (temaActivo !== 'all' && r.tema !== temaActivo) return false;
    // Filtra por título o descripción si hay texto en el buscador
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return r.titulo.toLowerCase().includes(q) || r.descripcion.toLowerCase().includes(q);
    }
    return true;
  }), [recursos, temaActivo, busqueda]);


  // ── Bloqueo de scroll cuando el menú mobile está abierto ─────────────────
  /**
   * Bloquea el scroll del body mientras el menú mobile está abierto,
   * para evitar que el fondo se desplace detrás del overlay del menú.
   * La limpieza restaura el overflow al desmontar o al cerrar el menú.
   */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);


  // ── Métricas para el sidebar ──────────────────────────────────────────────
  /**
   * Objeto que mapea cada tema a su cantidad de recursos.
   * Lo usa el BibSidebar para mostrar los contadores junto a cada tema.
   * Se recalcula solo cuando cambia la lista completa de recursos.
   */
  const conteoPorTema = useMemo(() =>
    (USE_MOCK ? MOCK_RECURSOS : recursos).reduce<Record<string, number>>((acc, r) => {
      acc[r.tema] = (acc[r.tema] ?? 0) + 1;
      return acc;
    }, {}),
  [recursos]);


  // ── Acciones ──────────────────────────────────────────────────────────────

  /** Restablece el filtro de tema y el texto de búsqueda a sus valores iniciales. */
  const limpiarFiltros = () => { setTemaActivo('all'); setBusqueda(''); };


  // ── Derivados para los paneles de contenido ───────────────────────────────
  // Separa los recursos filtrados por tipo para pasarlos a cada lista
  const articulos     = filtrados.filter(r => r.tipo === 'articulo');
  const guias         = filtrados.filter(r => r.tipo === 'guia');
  const cuestionarios = filtrados.filter(r => r.tipo === 'cuestionario');

  /** Etiqueta legible del tipo activo para mostrar en el encabezado de la sección. */
  const panelLabel = tipoActivo === 'all'
    ? 'Todos los recursos'
    : TIPOS.find(t => t.id === tipoActivo)?.label ?? '';


  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="biblioteca">

      {/* Barra de navegación principal con soporte para menú mobile */}
      <Navbar
        onMenuToggle={() => setMenuOpen(prev => !prev)}
        menuOpen={menuOpen}
      />

      <div className="biblioteca__body">

        {/* Sidebar con filtros de tipo y tema, y conteos por categoría */}
        <BibSidebar
          tipos={TIPOS}
          temas={TEMAS}
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
              <h1>Aprende a protegerte<br /><span>en el mundo digital</span></h1>
              <p>Artículos, guías y cuestionarios para fortalecer tu conocimiento en ciberseguridad.</p>

              {/* Campo de búsqueda: filtra recursos por título y descripción en tiempo real */}
              <div className="biblioteca__search">
                <Search size={14} className="biblioteca__search-icon" />
                <input
                  type="search"
                  placeholder="Buscar recursos por palabra clave…"
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
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
                    {TEMAS.find(t => t.id === temaActivo)?.label ?? temaActivo}
                    <span className="biblioteca__chip-remove">✕</span>
                  </button>
                )}
                {/* Contador de resultados; muestra '…' durante la carga */}
                <span className="biblioteca__result-count">
                  {loading ? '…' : `${filtrados.length} resultado${filtrados.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {/* Estado de carga mientras se resuelven las peticiones a la API */}
            {loading && <div className="biblioteca__loading">Cargando recursos…</div>}

            {/* Mensaje de error si la carga falló (solo visible cuando no está cargando) */}
            {error && !loading && (
              <div className="biblioteca__error">
                <p>No se pudieron cargar los recursos.</p>
                <small>{error}</small>
              </div>
            )}

            {/* Paneles de contenido: se renderiza el componente correspondiente
                al tipo de contenido activo en el filtro del sidebar */}
            {!loading && !error && (
              <>
                {/* Vista general: muestra todos los tipos en FeaturedGrid */}
                {tipoActivo === 'all'          && <FeaturedGrid recursos={filtrados}     onLimpiar={limpiarFiltros} />}

                {/* Vista de artículos */}
                {tipoActivo === 'articulo'     && <ArticlesList recursos={articulos}     onLimpiar={limpiarFiltros} />}

                {/* Vista de guías: también usa FeaturedGrid por su formato visual */}
                {tipoActivo === 'guia'         && <FeaturedGrid recursos={guias}         onLimpiar={limpiarFiltros} />}

                {/* Vista de cuestionarios */}
                {tipoActivo === 'cuestionario' && <QuizzesList  recursos={cuestionarios} onLimpiar={limpiarFiltros} />}
              </>
            )}

          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}