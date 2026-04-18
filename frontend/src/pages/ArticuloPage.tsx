import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/articulo.css';

const MOCK_ARTICULOS: Record<number, {
  titulo: string; categoria: string; autor: string;
  tiempoLectura: number; imagen: string;
  secciones: { titulo: string; contenido: string }[];
}> = {
  2: {
    titulo: 'Cómo Cifrar tus Archivos Sensibles',
    categoria: 'Seguridad de Datos',
    autor: 'Equipo CyberGuard',
    tiempoLectura: 8,
    imagen: 'https://picsum.photos/seed/a6/1200/500',
    secciones: [
      { titulo: '¿Por qué cifrar tus archivos?', contenido: `El cifrado convierte tus archivos en datos ilegibles para cualquier persona sin la clave correcta.\n\nSin cifrado, documentos como contratos o información bancaria quedan expuestos con solo acceder al disco duro.` },
      { titulo: 'Cifrado en Windows con BitLocker', contenido: `BitLocker es la herramienta nativa de Windows para cifrar unidades completas.\n\n- Ve a Panel de Control → Sistema y Seguridad → Cifrado de Unidad BitLocker.\n- Haz clic en "Activar BitLocker" junto a la unidad que deseas cifrar.\n- Guarda la clave de recuperación en un lugar seguro.` },
      { titulo: 'Cifrado en macOS con FileVault', contenido: `FileVault cifra el disco de inicio completo en Mac.\n\n- Ve a Preferencias del Sistema → Seguridad y Privacidad → FileVault.\n- Activa FileVault y guarda la clave de recuperación.` },
      { titulo: 'Cifrado de archivos individuales', contenido: `Usa herramientas como:\n- VeraCrypt — contenedores cifrados portables.\n- 7-Zip — comprime con contraseña AES-256.\n- GPG — cifrado asimétrico para archivos y correos.` },
      { titulo: 'Buenas prácticas', contenido: `- Usa contraseñas largas (20+ caracteres).\n- Guarda claves de recuperación en un gestor de contraseñas.\n- No almacenes la clave en el mismo dispositivo cifrado.` },
    ],
  },
  3: {
    titulo: 'La Importancia de las Contraseñas Fuertes',
    categoria: 'Control de Acceso',
    autor: 'Equipo CyberGuard',
    tiempoLectura: 6,
    imagen: 'https://picsum.photos/seed/a2/1200/500',
    secciones: [
      { titulo: '¿Por qué importa tu contraseña?', contenido: `Más del 80% de las brechas de seguridad se deben a contraseñas comprometidas o reutilizadas.\n\nUna contraseña fuerte es tu primera y más importante línea de defensa.` },
      { titulo: 'Características de una contraseña segura', contenido: `- Mínimo 12 caracteres — preferiblemente 16 o más.\n- Combina letras mayúsculas, minúsculas, números y símbolos.\n- No uses palabras del diccionario ni nombres propios.\n- Nunca incluyas tu nombre o fecha de nacimiento.` },
      { titulo: 'Gestores de contraseñas', contenido: `Opciones recomendadas:\n- Bitwarden — gratuito y de código abierto.\n- 1Password — excelente para equipos.\n- KeePassXC — local, sin nube.\n\nSolo necesitas recordar una contraseña maestra fuerte.` },
      { titulo: 'Contraseñas comprometidas', contenido: `Verifica si tu contraseña ya fue expuesta en haveibeenpwned.com.\n\nSi aparece allí, cámbiala inmediatamente en todos los servicios donde la uses.` },
    ],
  },
  4: {
    titulo: 'AES vs RSA: ¿Cuándo Usar Cada Algoritmo?',
    categoria: 'Criptografía',
    autor: 'Equipo CyberGuard',
    tiempoLectura: 7,
    imagen: 'https://picsum.photos/seed/a5/1200/500',
    secciones: [
      { titulo: '¿Qué es el cifrado simétrico?', contenido: `El cifrado simétrico usa la misma clave para cifrar y descifrar. Es muy rápido para grandes volúmenes de datos.\n\nAES-256 es el algoritmo simétrico más usado y se considera prácticamente irrompible.` },
      { titulo: '¿Qué es el cifrado asimétrico?', contenido: `El cifrado asimétrico usa un par de claves: pública (cifrar) y privada (descifrar).\n\nRSA es el más conocido. Es más lento que AES pero permite comunicaciones seguras sin compartir secretos previamente.` },
      { titulo: '¿Cuándo usar AES?', contenido: `- Cifrar archivos o discos completos.\n- Cuando la velocidad es crítica.\n- Cuando emisor y receptor ya comparten la clave.\n\nEjemplos: BitLocker, 7-Zip con AES-256.` },
      { titulo: '¿Cuándo usar RSA?', contenido: `- Intercambiar claves de forma segura por primera vez.\n- Firmar digitalmente documentos.\n\nHTTPS usa RSA para intercambiar una clave AES temporal — lo mejor de ambos mundos.` },
    ],
  },
  5: {
    titulo: 'Phishing: Cómo Identificar Correos Sospechosos',
    categoria: 'Conciencia del Usuario',
    autor: 'Equipo CyberGuard',
    tiempoLectura: 5,
    imagen: 'https://picsum.photos/seed/a1/1200/500',
    secciones: [
      { titulo: '¿Qué es el phishing?', contenido: `El phishing es un ataque donde los ciberdelincuentes se hacen pasar por entidades de confianza para robar tus credenciales.\n\nEl 90% de los ciberataques comienzan con un correo de phishing.` },
      { titulo: 'Señales de alerta', contenido: `- Remitente sospechoso — dominio falso como "paypa1.com".\n- Urgencia artificial — "Tu cuenta será bloqueada en 24 horas".\n- Errores ortográficos o gramaticales.\n- Links que muestran URLs diferentes al pasar el cursor.` },
      { titulo: 'Qué hacer si recibes uno', contenido: `- No hagas clic en ningún enlace.\n- No descargues adjuntos.\n- Reporta el correo como phishing.\n- Si crees que fuiste víctima, cambia tu contraseña y activa 2FA.` },
      { titulo: 'Herramientas de verificación', contenido: `- Pasa el cursor sobre links para ver la URL real.\n- Usa VirusTotal para analizar URLs o archivos sospechosos.\n- Activa el filtro anti-phishing de tu navegador.` },
    ],
  },
  6: {
    titulo: 'Ransomware: Qué Es y Cómo Prevenirlo',
    categoria: 'Detección de Amenazas',
    autor: 'Equipo CyberGuard',
    tiempoLectura: 10,
    imagen: 'https://picsum.photos/seed/a3/1200/500',
    secciones: [
      { titulo: '¿Qué es el ransomware?', contenido: `El ransomware cifra todos tus archivos y exige un pago en criptomonedas para devolverte el acceso.\n\nEmpresas, hospitales y gobiernos han sido víctimas de ataques millonarios.` },
      { titulo: '¿Cómo llega?', contenido: `- Correos de phishing con adjuntos maliciosos.\n- Sitios web comprometidos.\n- Software pirata de fuentes no oficiales.\n- Conexiones RDP sin protección.\n- Dispositivos USB infectados.` },
      { titulo: 'Prevención', contenido: `- Mantén tu sistema siempre actualizado.\n- No abras adjuntos de correos inesperados.\n- Usa antivirus con protección en tiempo real.\n- Haz copias de seguridad en disco desconectado de la red.` },
      { titulo: 'Qué hacer si te infectas', contenido: `- Desconecta el dispositivo de la red inmediatamente.\n- No pagues el rescate — no garantiza recuperar los archivos.\n- Restaura desde tu última copia de seguridad limpia.` },
    ],
  },
  7: {
    titulo: 'VPN: ¿Realmente Protegen tu Privacidad?',
    categoria: 'Seguridad en Redes',
    autor: 'Equipo CyberGuard',
    tiempoLectura: 9,
    imagen: 'https://picsum.photos/seed/a4/1200/500',
    secciones: [
      { titulo: '¿Qué hace una VPN?', contenido: `Una VPN crea un túnel cifrado entre tu dispositivo y un servidor remoto, ocultando tu IP y cifrando tu tráfico.\n\nEs útil principalmente en redes Wi-Fi públicas o para evadir restricciones geográficas.` },
      { titulo: 'Lo que una VPN NO hace', contenido: `- No te hace anónimo completamente.\n- No protege contra malware o phishing.\n- No impide el rastreo con cookies.\n- No protege contraseñas débiles.` },
      { titulo: '¿Cuándo usarla?', contenido: `- En Wi-Fi públicas (cafeterías, aeropuertos).\n- Para evitar que tu ISP registre tu actividad.\n- Para acceder a contenido bloqueado geográficamente.\n- Trabajo remoto con recursos corporativos.` },
      { titulo: 'Cómo elegir una buena VPN', contenido: `- Política de no registros (no-logs) auditada.\n- Protocolo moderno: WireGuard o OpenVPN.\n- Evita VPNs gratuitas — tus datos son el producto.\n\nOpciones confiables: Mullvad, ProtonVPN, IVPN.` },
    ],
  },
};

export default function ArticuloPage() {
  const { id } = useParams<{ id: string }>();
  const articulo = MOCK_ARTICULOS[Number(id)];

  if (!articulo) {
    return (
      <div className="articulo-notfound">
        <Navbar />
        <div className="articulo-notfound__body">
          <p>Artículo no encontrado.</p>
          <Link to="/biblioteca" className="btn-back">← Volver a la Biblioteca</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="articulo-page">
      <Navbar />

      <div className="articulo__hero">
        <img src={articulo.imagen} alt={articulo.titulo} className="articulo__hero-img" />
        <div className="articulo__hero-overlay" />
        <div className="articulo__hero-body">
          <Link to="/biblioteca" className="articulo__back">
            <ArrowLeft size={14} /> Biblioteca
          </Link>
          <div className="articulo__meta">
            <span className="articulo__categoria"><Tag size={12} /> {articulo.categoria}</span>
            <span className="articulo__tiempo"><Clock size={12} /> {articulo.tiempoLectura} min lectura</span>
          </div>
          <h1 className="articulo__titulo">{articulo.titulo}</h1>
          <p className="articulo__autor">Por {articulo.autor}</p>
        </div>
      </div>

      <div className="articulo__layout">
        <aside className="articulo__index">
          <p className="articulo__index-title">Contenido</p>
          <nav>
            {articulo.secciones.map((s, i) => (
              <a key={i} href={`#seccion-${i}`} className="articulo__index-link">{s.titulo}</a>
            ))}
          </nav>
        </aside>

        <article className="articulo__content">
          {articulo.secciones.map((s, i) => (
            <section key={i} id={`seccion-${i}`} className="articulo__seccion">
              <h2 className="articulo__seccion-titulo">{s.titulo}</h2>
              <div className="articulo__seccion-body">
                {s.contenido.split('\n').map((linea, j) => {
                  if (!linea.trim()) return null;
                  if (linea.startsWith('- ')) return <li key={j}>{linea.slice(2)}</li>;
                  return <p key={j}>{linea}</p>;
                })}
              </div>
            </section>
          ))}
        </article>
      </div>

      <Footer />
    </div>
  );
}