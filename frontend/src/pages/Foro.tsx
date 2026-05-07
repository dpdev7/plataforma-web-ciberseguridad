import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { apiFetch } from '../utils/api';
import '../styles/Foro.css';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

interface Comentario {
  comentario_id: string;
  contenido: string;
  fecha_creacion: string;
  usuario: { usuario_id: string; nombre?: string };
}

interface Publicacion {
  publicacion_id: string;
  titulo: string;
  contenido: string;
  es_anonima: boolean;
  fecha_creacion: string;
  editada: boolean;
  usuario: { usuario_id: string; nombre?: string } | null;
  comentarios: Comentario[];
  categoria?: string;
  etiquetas?: string[];
}

interface Categoria {
  id: string;
  label: string;
}

// Íconos por categoría — solo agregar aquí cuando añadas una nueva al enum
const ICONOS: Record<string, string> = {
  general:      'public',
  ciberataques: 'security',
  contrasenas:  'lock',
  proteccion:   'shield',
  ayuda:        'help',
};

function tiempoRelativo(fecha: string): string {
  const diff = Date.now() - new Date(fecha).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} min`;
  const horas = Math.floor(mins / 60);
  if (horas < 24) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} día${dias > 1 ? 's' : ''}`;
}

export default function Foro() {
  const navigate = useNavigate();
  const [usuario,        setUsuario]        = useState<Usuario | null>(null);
  const [verificando,    setVerificando]    = useState(true);
  const [publicaciones,  setPublicaciones]  = useState<Publicacion[]>([]);
  const [categorias,     setCategorias]     = useState<Categoria[]>([]);  // 👈 desde backend
  const [mostrarModal,   setMostrarModal]   = useState(false);
  const [busqueda,       setBusqueda]       = useState('');
  const [ordenHilos,     setOrdenHilos]     = useState<'recientes' | 'antiguos'>('recientes');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  // Nuevo hilo
  const [titulo,         setTitulo]         = useState('');
  const [contenido,      setContenido]      = useState('');
  const [esAnonima,      setEsAnonima]      = useState(false);
  const [enviando,       setEnviando]       = useState(false);
  const [error,          setError]          = useState('');
  const [categoriaHilo,  setCategoriaHilo]  = useState('');
  const [etiquetasHilo,  setEtiquetasHilo]  = useState('');

  // Verificar autenticación
  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch('/usuario/me/')
      .then(data => {
        if (data.authenticated) setUsuario(data.usuario);
      })
      .catch(() => {})
      .finally(() => setVerificando(false));
  }, []);

  // Cargar categorías desde el backend  👈
  useEffect(() => {
    apiFetch('/publicacion/categorias/')
      .then(data => {
        if (data.success) setCategorias(data.result);
      })
      .catch(() => {
        // fallback por si falla el endpoint
        setCategorias([
          { id: 'general',      label: 'General'       },
          { id: 'ciberataques', label: 'Ciberataques'  },
          { id: 'contrasenas',  label: 'Contraseñas'   },
          { id: 'proteccion',   label: 'Protección'    },
          { id: 'ayuda',        label: 'Ayuda Técnica' },
        ]);
      });
  }, []);

  // Cargar publicaciones
  useEffect(() => {
    if (!usuario) return;
    apiFetch('/publicacion/all/')
      .then(data => {
        if (data.success) { 
          const resultado = Array.isArray(data.result)
            ? data.result.map((p: Publicacion) => ({ 
                ...p,
                comentarios: p.comentarios ?? [],
              }))
            : [];
          setPublicaciones(resultado);
        } else {
          setPublicaciones([]);
        }
      })
      .catch(() => setPublicaciones([]));
  }, [usuario]);

  const publicacionesFiltradas = publicaciones.filter(p => {
    const coincideBusqueda   = p.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria  = !categoriaFiltro || p.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  const publicacionesOrdenadas = [...publicacionesFiltradas].sort((a, b) => {  // 👈 ordenar las filtradas
    const fechaA = new Date(a.fecha_creacion).getTime();
    const fechaB = new Date(b.fecha_creacion).getTime();
    return ordenHilos === 'recientes' ? fechaB - fechaA : fechaA - fechaB;
  });

  const crearHilo = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      setError('El título y el contenido son obligatorios.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const data = await apiFetch('/publicacion/crear/', {
        method: 'POST',
        body: JSON.stringify({
          titulo,
          contenido,
          es_anonima:  esAnonima,
          usuario_id:  usuario?.id ?? '',
          categoria: categoriaHilo !== '' ? categoriaHilo : null,  
        }),
      });
      if (data.success) {
        setMostrarModal(false);
        setTitulo('');
        setContenido('');
        setCategoriaHilo('');
        setPublicaciones(prev => [{
          ...data.result,
          usuario: esAnonima ? null : {
            usuario_id: usuario?.id ?? '',
            nombre:     usuario?.nombre,
          },
          comentarios: data.result.comentarios ?? [],
        }, ...prev]);
      } else {
        setError('Error al crear el hilo.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setEnviando(false);
    }
  };

  if (verificando) {
    return (
      <div className="foro-loading">
        <div className="foro-spinner" />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="foro-restringido">
        <Navbar />
        <div className="restringido-contenido">
          <div className="restringido-card">
            <div className="restringido-icono">
              <span className="material-symbols-outlined">lock</span>
            </div>
            <h2 className="restringido-titulo">Acceso Restringido</h2>
            <p className="restringido-desc">
              El Panel de Comunidad es exclusivo para miembros registrados de CyberGuard.
              Inicia sesión o crea una cuenta para conectar con otros usuarios, compartir
              conocimientos y resolver dudas sobre ciberseguridad.
            </p>
            <div className="restringido-beneficios">
              <div className="beneficio">
                <span className="material-symbols-outlined">forum</span>
                <span>Crea y responde hilos</span>
              </div>
              <div className="beneficio">
                <span className="material-symbols-outlined">people</span>
                <span>Conecta con la comunidad</span>
              </div>
              <div className="beneficio">
                <span className="material-symbols-outlined">verified</span>
                <span>Comparte tu conocimiento</span>
              </div>
            </div>
            <div className="restringido-botones">
              <button className="btn-cancelar" onClick={() => navigate(-1)}>← Regresar</button>
              <Link to="/login"    className="btn-secundario">Iniciar Sesión</Link>
              <Link to="/register" className="btn-publicar">Registrarse</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="foro-page">
      <Navbar />

      <header className="foro-hero">
        <div className="foro-hero__texto">
          <h1 className="foro-hero__title">Panel de Comunidad</h1>
          <p className="foro-hero__subtitle">
            Conecta con otros usuarios, comparte conocimientos y resuelve dudas sobre ciberseguridad.
          </p>
        </div>
        <button className="btn-nuevo-hilo" onClick={() => setMostrarModal(true)}>
          <span className="material-symbols-outlined">add_circle</span>
          Crear Nuevo Hilo
        </button>
      </header>

      <div className="foro-contenido">
        <div className="foro-layout">
          <aside className="foro-sidebar">
            <div className="sidebar-seccion">
              <h3 className="sidebar-titulo">Categorías</h3>
              <ul className="sidebar-lista">
                <li
                  className={`sidebar-item ${!categoriaFiltro ? 'sidebar-item--active' : ''}`}
                  onClick={() => setCategoriaFiltro('')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setCategoriaFiltro('');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span className="material-symbols-outlined">apps</span>
                  Todas
                </li>
                {categorias.map(cat => (  // 👈 categorías dinámicas desde backend
                  <li
                    key={cat.id}
                    className={`sidebar-item ${categoriaFiltro === cat.id ? 'sidebar-item--active' : ''}`}
                    onClick={() => setCategoriaFiltro(cat.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCategoriaFiltro(cat.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="material-symbols-outlined">
                      {ICONOS[cat.id] ?? 'label'}  {/* 👈 ícono por id */}
                    </span>
                    {cat.label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="foro-main">
            <div className="foro-categoria-mobile">
              <label htmlFor="foro-categoria-select" className="foro-categoria-mobile__label">
                Categoría
              </label>
              <div className="foro-categoria-mobile__select-wrap">
                <span className="material-symbols-outlined" aria-hidden="true">
                  category
                </span>
                <select
                  id="foro-categoria-select"
                  className="foro-categoria-mobile__select"
                  value={categoriaFiltro}
                  onChange={e => setCategoriaFiltro(e.target.value)}
                  aria-label="Filtrar hilos por categoría"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="foro-busqueda-wrap">
              <span className="material-symbols-outlined foro-busqueda-icon">search</span>
              <input
                className="foro-busqueda"
                placeholder="Buscar en el panel de comunidad"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                aria-label="Buscar hilos en el panel de comunidad"
              />
            </div>

            <div className="foro-filtros">
              <label className="foro-filtros__label">Ordenar hilos:</label>
              <div className="foro-toggle">
                <button
                  className={`foro-toggle__btn ${ordenHilos === 'recientes' ? 'active' : ''}`}
                  onClick={() => setOrdenHilos('recientes')}
                >
                  Más recientes
                </button>
                <button
                  className={`foro-toggle__btn ${ordenHilos === 'antiguos' ? 'active' : ''}`}
                  onClick={() => setOrdenHilos('antiguos')}
                >
                  Más antiguos
                </button>
              </div>
            </div>

            <div className="foro-lista">
              {publicacionesOrdenadas.length === 0 ? (
                <div className="foro-vacio">
                  <span className="material-symbols-outlined">forum</span>
                  <p>No se encontraron hilos.</p>
                </div>
              ) : (
                publicacionesOrdenadas.map(pub => (
                  <Link
                    key={pub.publicacion_id}
                    to={`/foro/${pub.publicacion_id}`}
                    className="hilo-card"
                  >
                    <div className="hilo-card__avatar">
                      <span className="material-symbols-outlined">
                        {pub.es_anonima ? 'person_off' : 'account_circle'}
                      </span>
                    </div>
                    <div className="hilo-card__body">
                      <h3 className="hilo-card__titulo">{pub.titulo}</h3>
                      <p className="hilo-card__preview">
                        {pub.contenido.slice(0, 120)}{pub.contenido.length > 120 ? '...' : ''}
                      </p>
                      <div className="hilo-card__meta">
                        <span>
                          Por <strong>{pub.es_anonima ? 'Anónimo' : (pub.usuario?.nombre ?? 'Usuario')}</strong>
                        </span>
                        <span>· {tiempoRelativo(pub.fecha_creacion)}</span>
                        <span>
                          · <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle' }}>chat_bubble</span>
                          {' '}{pub.comentarios.length} respuesta{pub.comentarios.length !== 1 ? 's' : ''}
                        </span>
                        {pub.editada && <span className="hilo-editado">· editado</span>}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal crear hilo */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal modal--grande" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crear un Nuevo Hilo</h2>
              <button className="modal-cerrar" onClick={() => setMostrarModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="modal-subtitle">Comparte tu pregunta o conocimiento con la comunidad.</p>

            <label className="campo-label">
              Título del Hilo
              <span className={`campo-contador ${titulo.length > 180 ? 'campo-contador--alerta' : ''}`}>
                {titulo.length}/200
              </span>
            </label>
            <input
              className="campo-input"
              placeholder="Ej: ¿Cómo puedo mejorar la seguridad de mi red Wi-Fi?"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              maxLength={200}
            />

            <label className="campo-label">
              Contenido del Hilo
              <span className={`campo-contador ${contenido.length > 4500 ? 'campo-contador--alerta' : ''}`}>
                {contenido.length}/5000
              </span>
            </label>
            <div data-color-mode="dark" style={{ marginBottom: '16px' }}>
              <MDEditor
                value={contenido}
                onChange={v => setContenido((v || '').slice(0, 5000))}
                height={200}
                preview="edit"
              />
            </div>

            <label className="campo-label">Categoría</label>
            <select
              className="campo-select"
              value={categoriaHilo}
              onChange={e => setCategoriaHilo(e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (  
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>

            <label className="campo-label">
              Etiquetas
              <span className={`campo-contador ${etiquetasHilo.length > 90 ? 'campo-contador--alerta' : ''}`}>
                {etiquetasHilo.length}/100
              </span>
            </label>
            <input
              className="campo-input"
              placeholder="Añade hasta 5 etiquetas (ej: phishing, malware, vpn)"
              value={etiquetasHilo}
              onChange={e => setEtiquetasHilo(e.target.value)}
              maxLength={100}
            />
            <p className="campo-hint">Separa las etiquetas con comas.</p>

            <label className="opcion-check" style={{ marginBottom: '20px' }}>
              <input
                type="checkbox"
                checked={esAnonima}
                onChange={e => setEsAnonima(e.target.checked)}
              />
              Publicar como Anónimo
            </label>

            {error && <p className="modal-error">{error}</p>}

            <div className="modal-botones">
              <button className="btn-cancelar" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button className="btn-publicar" onClick={crearHilo} disabled={enviando}>
                {enviando ? 'Publicando...' : '✦ Publicar Hilo'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
