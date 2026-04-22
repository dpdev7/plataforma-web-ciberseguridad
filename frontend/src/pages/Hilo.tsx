import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
            usuario: { usuario_id: usuario?.id ?? '' },
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
            <div>
              <strong>{publicacion.es_anonima ? 'Anónimo' : (publicacion.usuario?.nombre ?? 'Usuario')}</strong>
              <span className="hilo-fecha">
                · Publicado {tiempoRelativo(publicacion.fecha_creacion)}
                {publicacion.editada && ' · editado'}
              </span>
            </div>
          </div>
          <h1 className="hilo-principal__titulo">{publicacion.titulo}</h1>
          <div className="hilo-principal__contenido">
  <ReactMarkdown>{publicacion.contenido}</ReactMarkdown>
</div>
        </div>

        {/* Comentarios */}
        <div className="hilo-comentarios">
          <h2 className="comentarios-titulo">
            Comentarios ({publicacion.comentarios.length})
          </h2>

          {publicacion.comentarios.length === 0 ? (
            <div className="foro-vacio">
              <span className="material-symbols-outlined">chat_bubble_outline</span>
              <p>Sé el primero en comentar.</p>
            </div>
          ) : (
            publicacion.comentarios.map(com => (
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

      <Footer />
    </div>
  );
}