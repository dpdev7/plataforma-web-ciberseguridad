import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
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
}

// Datos ficticios para desarrollo
const HILO_MOCK: Publicacion = {
  publicacion_id: '1',
  titulo: 'Consejos para proteger tu router doméstico',
  contenido: `Quería compartir algunos consejos clave para asegurar sus routers domésticos, ya que son la puerta de entrada a su red y a menudo se pasan por alto.

**Cambiar la contraseña de administrador:** No dejen la contraseña por defecto. Elijan una contraseña fuerte y única.

**Actualizar el firmware:** Mantengan el firmware de su router actualizado para protegerse contra vulnerabilidades conocidas.

**Desactivar el acceso remoto:** Si no lo necesitan, desactiven la administración remota para evitar accesos no autorizados desde fuera de su red.

**Usar cifrado WPA3:** Si su router lo soporta, usen WPA3 para su red Wi-Fi.

¿Tienen algún otro consejo que agregar? ¡Compartan sus ideas!`,
  es_anonima: false,
  fecha_creacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  editada: false,
  usuario: { usuario_id: 'u1' },
  comentarios: [
    {
      comentario_id: 'c1',
      contenido: 'Revisa la configuración DNS de tu router. Si los valores no son los de tu proveedor, es una señal de alerta.',
      fecha_creacion: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      usuario: { usuario_id: 'u2' },
    },
    {
      comentario_id: 'c2',
      contenido: 'Además, verifica la lista de dispositivos conectados a tu WiFi. Si ves alguno que no reconoces, bloquéalo de inmediato.',
      fecha_creacion: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      usuario: { usuario_id: 'u3' },
    },
  ],
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



export default function Hilo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [verificando, setVerificando] = useState(true);
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const [tituloEdit, setTituloEdit] = useState('');
  const [contenidoEdit, setContenidoEdit] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [ordenComentarios, setOrdenComentarios] = useState<'recientes' | 'antiguos'>('recientes');

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch('/usuario/me/')
    .then(data => {
      if (data.authenticated) {
        setUsuario(data.usuario);
      }
    })
    .catch(() => {})
    .finally(() => setVerificando(false));
  }, []);

  useEffect(() => {
  if (!usuario) return;
  apiFetch(`/publicacion/${id}/`)
    .then(data => {
      console.log('Respuesta hilo:', data);
      if (data.success) {
        setPublicacion({
          ...data.result,
          comentarios: data.result.comentarios ?? [],
        });
      } else {
        setPublicacion(HILO_MOCK);
      }
    })
    .catch(() => setPublicacion(HILO_MOCK));
}, [usuario, id]);

  const enviarComentario = async () => {
    if (!comentario.trim()) return;
    setEnviando(true);
    setError('');
    try {
      const data = await apiFetch('/publicacion/comentario/crear/', {
        method: 'POST',
        body: JSON.stringify({
          contenido: comentario,
          usuario_id: usuario?.id ?? '',
          publicacion_id: id,
        }),
      });
      console.log('Respuesta comentario:', data);
      if (data.success) {
        setComentario('');
        // Agregar comentario localmente
        setPublicacion(prev => prev ? {
          ...prev,
            comentarios: [...prev.comentarios, {
  comentario_id: data.result.comentario_id,
  contenido: data.result.contenido,
  fecha_creacion: data.result.fecha_creacion,
  usuario: { 
    usuario_id: usuario?.id ?? '',
    nombre: usuario?.nombre
  },
}],

        } : prev);
      } else {
        setError('Error al enviar el comentario.');
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
            Inicia sesión o crea una cuenta para participar.
          </p>
          <div className="restringido-botones">
            <button className="btn-cancelar" onClick={() => navigate(-1)}>← Regresar</button>
            <Link to="/login" className="btn-secundario">Iniciar Sesión</Link>
            <Link to="/register" className="btn-publicar">Registrarse</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

if (!publicacion) {
    return (
      <div className="foro-loading">
        <div className="foro-spinner" />
      </div>
    );
  }

const esAutor = publicacion && !publicacion.es_anonima &&
  publicacion.usuario?.usuario_id === usuario?.id;

const iniciarEdicion = () => {
  setTituloEdit(publicacion?.titulo ?? '');
  setContenidoEdit(publicacion?.contenido ?? '');
  setEditando(true);
};

const guardarEdicion = async () => {
  if (!tituloEdit.trim() || !contenidoEdit.trim()) return;
  setGuardando(true);
  try {
    const data = await apiFetch(`/publicacion/editar/${publicacion?.publicacion_id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        titulo: tituloEdit,
        contenido: contenidoEdit,
      }),
    });
    if (data.success) {
      setPublicacion(prev => prev ? {
        ...prev,
        titulo: tituloEdit,
        contenido: contenidoEdit,
        editada: true,
      } : prev);
      setEditando(false);
    }
  } catch {
    console.error('Error al editar');
  } finally {
    setGuardando(false);
  }
};

const comentariosOrdenados = [...publicacion.comentarios].sort((a, b) => {
  const fechaA = new Date(a.fecha_creacion).getTime();
  const fechaB = new Date(b.fecha_creacion).getTime();

  return ordenComentarios === 'recientes'
    ? fechaB - fechaA
    : fechaA - fechaB;
});

const eliminarHilo = async () => {
  setEliminando(true);
  try {
    const data = await apiFetch(`/publicacion/eliminar/${publicacion?.publicacion_id}/`, {
      method: 'DELETE',
    });
    if (data.success) {
      navigate('/foro');
    }
  } catch {
    console.error('Error al eliminar');
  } finally {
    setEliminando(false);
    setConfirmarEliminar(false);
  }
};

  return (
    <div className="foro-page">
      <Navbar />

      <main className="hilo-detalle">

        {/* Breadcrumb */}
        <div className="hilo-breadcrumb">
          <Link to="/foro">Panel de Comunidad</Link>
          <span className="material-symbols-outlined">chevron_right</span>
          <span>{publicacion.titulo.slice(0, 40)}...</span>
        </div>

        {/* Publicación principal */}
        <div className="hilo-principal">
  <div className="hilo-principal__autor">
    <span className="material-symbols-outlined hilo-avatar-grande">
      {publicacion.es_anonima ? 'person_off' : 'account_circle'}
    </span>
    <div className="hilo-principal__autor-info">
      <strong>{publicacion.es_anonima ? 'Anónimo' : (publicacion.usuario?.nombre ?? 'Usuario')}</strong>
      <span className="hilo-fecha">
        · Publicado {tiempoRelativo(publicacion.fecha_creacion)}
        {publicacion.editada && ' · editado'}
      </span>
    </div>
    {esAutor && !editando && (
      <div className="hilo-acciones">
        <button className="hilo-accion-btn" onClick={iniciarEdicion} title="Editar">
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button className="hilo-accion-btn hilo-accion-btn--danger" onClick={() => setConfirmarEliminar(true)} title="Eliminar">
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    )}
  </div>

  {editando ? (
    <div className="hilo-editor">
      <label className="campo-label">Título</label>
      <input
        className="campo-input"
        value={tituloEdit}
        onChange={e => setTituloEdit(e.target.value)}
      />
      <label className="campo-label">Contenido</label>
      <div data-color-mode="dark" style={{ marginBottom: '16px' }}>
        <MDEditor
          value={contenidoEdit}
          onChange={v => setContenidoEdit(v || '')}
          height={200}
          preview="edit"
        />
      </div>
      <div className="hilo-editor-botones">
        <button className="btn-cancelar" onClick={() => setEditando(false)}>
          Cancelar
        </button>
        <button className="btn-publicar" onClick={guardarEdicion} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  ) : (
    <>
      <h1 className="hilo-principal__titulo">{publicacion.titulo}</h1>
      <div className="hilo-principal__contenido">
        <ReactMarkdown>{publicacion.contenido}</ReactMarkdown>
      </div>
    </>
  )}
</div>

        {/* Comentarios */}
        <div className="hilo-comentarios">
          <h2 className="comentarios-titulo">
            Comentarios ({publicacion.comentarios.length})
          </h2>

          <div style={{ marginBottom: '12px' }}>
            <select
              value={ordenComentarios}
              onChange={(e) => setOrdenComentarios(e.target.value as 'recientes' | 'antiguos')}
              className="campo-select"
            >
              <option value="recientes">Más recientes primero</option>
              <option value="antiguos">Más antiguos primero</option>
            </select>
          </div>

          {publicacion.comentarios.length === 0 ? (
            <div className="foro-vacio">
              <span className="material-symbols-outlined">chat_bubble_outline</span>
              <p>Sé el primero en comentar.</p>
            </div>
          ) : (
            comentariosOrdenados.map(com => (
              <div key={com.comentario_id} className="comentario-card">
                <div className="comentario-card__header">
                  <span className="material-symbols-outlined comentario-avatar">account_circle</span>
                  <strong>{com.usuario?.nombre ?? 'Usuario'}</strong>
                  <span className="hilo-fecha">· {tiempoRelativo(com.fecha_creacion)}</span>
                </div>
                <p className="comentario-card__contenido">{com.contenido}</p>
              </div>
            ))
          )}
        </div>

        {/* Añadir comentario */}
        <div className="hilo-nuevo-comentario">
          <h3>Añadir un comentario</h3>
          <textarea
            className="campo-textarea"
            placeholder="Escribe tu respuesta aquí..."
            value={comentario}
            onChange={e => setComentario(e.target.value)}
          />
          {error && <p className="modal-error">{error}</p>}
          <div className="nuevo-comentario-botones">
            <button
              className="btn-publicar"
              onClick={enviarComentario}
              disabled={enviando || !comentario.trim()}
            >
              {enviando ? 'Enviando...' : 'Enviar Comentario'}
            </button>
          </div>
        </div>

      </main>

    {confirmarEliminar && (
  <div className="modal-overlay" onClick={() => setConfirmarEliminar(false)}>
    <div className="modal modal--pequeño" onClick={e => e.stopPropagation()}>
      <div className="restringido-icono" style={{ margin: '0 auto 20px' }}>
        <span className="material-symbols-outlined" style={{ color: '#f85149' }}>delete_forever</span>
      </div>
      <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '12px' }}>
        ¿Eliminar publicación?
      </h2>
      <p style={{ textAlign: 'center', color: '#8b949e', marginBottom: '24px', fontSize: '0.9rem' }}>
        Esta acción no se puede deshacer. El hilo y todos sus comentarios serán eliminados permanentemente.
      </p>
      <div className="modal-botones">
        <button className="btn-cancelar" onClick={() => setConfirmarEliminar(false)}>
          Cancelar
        </button>
        <button
          className="btn-eliminar"
          onClick={eliminarHilo}
          disabled={eliminando}
        >
          {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
      </div>
    </div>
  </div>
)}
      <Footer />
    </div>
  );
}