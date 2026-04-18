// Vista pública de una guía.
// Sidebar con pasos de progreso + contenido por paso.
// Conectar: reemplazar MOCK por fetch a /api/recursos/:id

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, Clock } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/guia.css';

const MOCK_GUIAS: Record<number, {
  titulo: string; categoria: string;
  tiempoLectura: number; descripcion: string;
  pasos: { titulo: string; contenido: string; imagen?: string }[];
}> = {
  1: {
    titulo: 'Guía Completa para Principiantes',
    categoria: 'Seguridad en Redes',
    tiempoLectura: 12,
    descripcion: 'Aprende los fundamentos de la ciberseguridad paso a paso.',
    pasos: [
      {
        titulo: 'Introducción',
        contenido: `La ciberseguridad es el conjunto de prácticas, tecnologías y procesos diseñados para proteger sistemas, redes y datos de ataques digitales.\n\nEn esta guía aprenderás los conceptos esenciales que todo usuario digital debe conocer para mantenerse seguro en línea. No necesitas conocimientos previos — empezamos desde cero.`,
      },
      {
        titulo: 'Amenazas más comunes',
        contenido: `Antes de protegerte, necesitas conocer a qué te enfrentas:\n\n**Phishing** — correos falsos que imitan empresas reales para robarte credenciales.\n\n**Malware** — software malicioso que se instala sin tu permiso (virus, troyanos, ransomware).\n\n**Ingeniería social** — manipulación psicológica para que reveles información confidencial.\n\n**Ataques de fuerza bruta** — intentos automatizados de adivinar tu contraseña.`,
        imagen: 'https://picsum.photos/seed/amenazas/800/300',
      },
      {
        titulo: 'Contraseñas seguras',
        contenido: `Tu contraseña es la primera línea de defensa. Una contraseña débil puede ser crackeada en segundos.\n\n**Reglas básicas:**\n- Mínimo 12 caracteres.\n- Combina mayúsculas, minúsculas, números y símbolos.\n- Nunca uses datos personales (nombre, fecha de nacimiento).\n- Usa una contraseña diferente para cada cuenta.\n\nUsa un gestor de contraseñas como Bitwarden o 1Password para recordarlas todas.`,
      },
      {
        titulo: 'Autenticación en dos pasos',
        contenido: `La autenticación de dos factores (2FA) agrega una capa extra de seguridad. Aunque alguien robe tu contraseña, necesitará también tu segundo factor.\n\n**Tipos de 2FA:**\n- **App autenticadora** (Google Authenticator, Authy) — el más seguro.\n- **SMS** — práctico pero vulnerable a SIM swapping.\n- **Llave física** (YubiKey) — el nivel más alto de seguridad.\n\nActiva 2FA en tu correo, banco y redes sociales como mínimo.`,
        imagen: 'https://picsum.photos/seed/2fa/800/300',
      },
      {
        titulo: 'Navegación segura',
        contenido: `Muchos ataques ocurren simplemente navegando la web. Sigue estas prácticas:\n\n- Verifica siempre que la URL comience con **https://**.\n- No hagas clic en enlaces de correos inesperados.\n- Descarga software solo de fuentes oficiales.\n- Usa un bloqueador de anuncios (uBlock Origin).\n- Evita redes Wi-Fi públicas para transacciones sensibles.`,
      },
      {
        titulo: 'Conclusión',
        contenido: `Has completado los fundamentos de ciberseguridad. Con estos conocimientos puedes proteger el 90% de las amenazas comunes que enfrenta un usuario normal.\n\nEl siguiente paso es poner en práctica lo aprendido: activa 2FA hoy mismo, revisa tus contraseñas y mantén tu software actualizado.\n\n¡Bienvenido al mundo de la ciberseguridad!`,
      },
    ],
  },
};

export default function GuiaPage() {
  const { id } = useParams<{ id: string }>();
  const guia = MOCK_GUIAS[Number(id)];
  const [pasoActivo, setPasoActivo] = useState(0);
  const [completados, setCompletados] = useState<number[]>([]);

  if (!guia) {
    return (
      <div className="guia-notfound">
        <Navbar />
        <div className="guia-notfound__body">
          <p>Guía no encontrada.</p>
          <Link to="/biblioteca" className="btn-back">← Volver a la Biblioteca</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const paso = guia.pasos[pasoActivo];
  const esUltimo = pasoActivo === guia.pasos.length - 1;

  const avanzar = () => {
    if (!completados.includes(pasoActivo))
      setCompletados(prev => [...prev, pasoActivo]);
    if (!esUltimo) setPasoActivo(prev => prev + 1);
  };

  const retroceder = () => {
    if (pasoActivo > 0) setPasoActivo(prev => prev - 1);
  };

  return (
    <div className="guia-page">
      <Navbar />

      <div className="guia__layout">

        {/* Sidebar de pasos */}
        <aside className="guia__sidebar">
          <Link to="/biblioteca" className="guia__back">
            <ArrowLeft size={13} /> Biblioteca
          </Link>

          <p className="guia__sidebar-title">Progreso de la Guía</p>

          <div className="guia__progreso-bar">
            <div
              className="guia__progreso-fill"
              style={{ width: `${(completados.length / guia.pasos.length) * 100}%` }}
            />
          </div>
          <p className="guia__progreso-label">
            {completados.length} de {guia.pasos.length} pasos completados
          </p>

          <nav className="guia__steps">
            {guia.pasos.map((p, i) => {
              const completado = completados.includes(i);
              const activo     = pasoActivo === i;
              return (
                <button
                  key={i}
                  className={`guia__step ${activo ? 'guia__step--active' : ''} ${completado ? 'guia__step--done' : ''}`}
                  onClick={() => setPasoActivo(i)}
                >
                  <span className="guia__step-icon">
                    {completado ? <CheckCircle size={14} /> : <Circle size={14} />}
                  </span>
                  <span className="guia__step-label">{p.titulo}</span>
                  {activo && <span className="guia__step-badge">Actual</span>}
                  {!activo && !completado && <span className="guia__step-pending">Pendiente</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Contenido del paso */}
        <main className="guia__content">
          <div className="guia__header">
            <div className="guia__meta">
              <Clock size={13} />
              <span>{guia.tiempoLectura} min lectura</span>
              <span className="guia__meta-sep">·</span>
              <span>{guia.categoria}</span>
            </div>
            <h1 className="guia__titulo">{guia.titulo}</h1>
          </div>

          <article className="guia__paso">
            <h2 className="guia__paso-titulo">
              {paso.titulo}
            </h2>

            {paso.imagen && (
              <div className="guia__paso-img">
                <img src={paso.imagen} alt={paso.titulo} />
              </div>
            )}

            <div className="guia__paso-body">
              {paso.contenido.split('\n').map((linea, i) => {
                if (!linea.trim()) return null;
                if (linea.startsWith('- ')) return <li key={i}>{linea.slice(2)}</li>;
                if (linea.startsWith('**') && linea.endsWith('**'))
                  return <h3 key={i} className="guia__paso-subtitulo">{linea.replace(/\*\*/g, '')}</h3>;
                return <p key={i}>{linea.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
              })}
            </div>
          </article>

          {/* Navegación */}
          <div className="guia__nav">
            <button
              className="btn-guia btn-guia--ghost"
              onClick={retroceder}
              disabled={pasoActivo === 0}
            >
              ← Anterior
            </button>
            <button
              className={`btn-guia ${esUltimo ? 'btn-guia--success' : 'btn-guia--primary'}`}
              onClick={avanzar}
            >
              {esUltimo ? '✓ Completar guía' : 'Siguiente →'}
            </button>
          </div>
        </main>

      </div>

      <Footer />
    </div>
  );
}