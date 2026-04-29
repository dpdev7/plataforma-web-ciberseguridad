import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/Amenazas.css';

// Tipos de datos
interface Amenaza {
  id: string;
  icono: string;
  nombre: string;
  descripcion: string;
  ejemploPractico: string;
}

interface Consejo {
  id: string;
  icono: string;
  titulo: string;
  contenido: string;
  ejemploPractico: string;
}

// Tipos de amenazas (columna 1)
const AMENAZAS: Amenaza[] = [
  {
    id: 'malware',
    icono: 'bug_report',
    nombre: 'Malware',
    descripcion:
      'El malware es software malintencionado diseñado para interrumpir, dañar o obtener acceso no autorizado a los sistemas informáticos. Los ciberdelincuentes usan malware para infectar dispositivos con el fin de robar datos, obtener credenciales bancarias, vender acceso a recursos informáticos o información personal, o extorsionar pagos de las víctimas.',
    ejemploPractico:
      'Un usuario descarga un editor de video "gratuito" de un sitio web no oficial. Al instalarlo, también instala un keylogger que registra cada pulsación de tecla, capturando contraseñas y enviándolas a los atacantes.',
  },
  {
    id: 'phishing',
    icono: 'phishing',
    nombre: 'Phishing',
    descripcion:
      'El phishing es un tipo de ciberataque que utiliza correos electrónicos, mensajes de texto, llamadas telefónicas o sitios web fraudulentos para engañar a la gente y hacer que comparta datos confidenciales, descargue malware o se exponga a la ciberdelincuencia.',
    ejemploPractico:
      'Recibes un correo que aparenta ser de tu banco, alertándote de un problema con tu pago. El enlace te dirige a una página falsa diseñada para robar tus datos de tarjeta.',
  },
  {
    id: 'ransomware',
    icono: 'lock',
    nombre: 'Ransomware',
    descripcion:
      'El ransomware es un tipo de malware que retiene como rehenes los datos confidenciales o el dispositivo de una víctima, amenazando con mantenerlos bloqueados, o algo peor, a menos que la víctima pague un rescate al atacante.',
    ejemploPractico:
      'Un empleado abre un archivo adjunto malicioso en un correo electrónico. El ransomware cifra todos los documentos de la empresa y exige 2 bitcoins para entregar la clave de descifrado.',
  },
  {
    id: 'mitm',
    icono: 'sync_alt',
    nombre: 'Ataque de Intermediario (MitM)',
    descripcion:
      'Un ataque Man-in-the-Middle (MitM), o "hombre en el medio", es una ciberamenaza donde un atacante intercepta secretamente la comunicación entre dos partes (ej. usuario y sitio web) para espiar, robar credenciales o modificar datos en tiempo real. Es común en redes Wi-Fi públicas no seguras y el atacante se posiciona entre el usuario y el router.',
    ejemploPractico:
      'Te conectas a una red Wi-Fi gratuita en una cafetería. Un atacante intercepta tu tráfico y captura tus credenciales de inicio de sesión bancario.',
  },
  {
    id: 'ddos',
    icono: 'cloud_off',
    nombre: 'Ataques DDoS',
    descripcion:
      'Un ataque de denegación de servicio distribuido (DDoS) es un intento malintencionado de interrumpir el tráfico normal de un servidor, servicio o red determinada, sobrecargando el objetivo o su infraestructura asociada con una avalancha de tráfico de Internet.',
    ejemploPractico:
      'Un grupo de cibercriminales lanza un ataque DDoS contra el sitio web de comercio electrónico de una corporación durante una venta importante, causando pérdidas millonarias.',
  },
  {
    id: 'sqli',
    icono: 'code',
    nombre: 'Inyección SQL',
    descripcion:
      'La inyección de código SQL* (Structured Query Language) es una técnica de inyección de código que se utiliza para modificar u obtener datos de bases de datos SQL. Mediante la inserción de sentencias SQL especializadas en un campo de entrada, un atacante puede ejecutar comandos que permitan obtener datos de la base de datos, destruir datos confidenciales u otras manipulaciones.',
    ejemploPractico:
      'En un campo de nombre de usuario, en lugar de un nombre, un atacante ingresa una instrucción SQL especial que hace que la base de datos devuelva todos los usuarios y contraseñas.',
  },
];

// Consejos y prevención (columna 2)
const CONSEJOS: Consejo[] = [
  {
    id: 'c-malware',
    icono: 'security',
    titulo: 'Protección contra Malware',
    contenido:
      'Una defensa robusta contra el malware se basa en varias capas de protección. Es crucial instalar y mantener actualizado un software antivirus y antimalware de confianza. Asegúrate de que tu sistema operativo y todas tus aplicaciones se actualicen automáticamente para corregir vulnerabilidades. Sé extremadamente cauteloso con las descargas de internet, especialmente de fuentes no oficiales o software gratuito. Usar un bloqueador de anuncios y scripts puede prevenir el malvertising.',
    ejemploPractico:
      'Instala la extensión uBlock Origin en tu navegador. Antes de descargar un programa, búscalo en Google para verificar si existen reportes de que incluya software no deseado. Revisa periódicamente los permisos de las apps en tu móvil y elimina aquellas que no sean estrictamente necesarias.',
  },
  {
    id: 'c-phishing',
    icono: 'phishing',
    titulo: 'Prevención de Phishing',
    contenido:
      'Verifica siempre la dirección del remitente en correos electrónicos. Las organizaciones legítimas nunca te pedirán contraseñas o datos bancarios por correo. Antes de hacer clic en cualquier enlace, pasa el cursor por encima para ver la URL real. Activa la autenticación de dos factores en todas tus cuentas importantes.',
    ejemploPractico:
      'Si recibes un correo de tu banco, en lugar de hacer clic en el enlace del correo, abre una nueva pestaña y escribe directamente la dirección del banco. Si el banco realmente necesita algo, lo verás al iniciar sesión normalmente.',
  },
  {
    id: 'c-ransomware',
    icono: 'backup',
    titulo: 'Defensa contra Ransomware',
    contenido:
      'La mejor defensa contra el ransomware es tener copias de seguridad actualizadas y desconectadas de la red. Sigue la regla 3-2-1: 3 copias de tus datos, en 2 medios diferentes, con 1 copia fuera del sitio. Nunca abras archivos adjuntos de remitentes desconocidos y mantén tu sistema actualizado.',
    ejemploPractico:
      'Conecta un disco duro externo cada semana, haz una copia de seguridad de tus archivos importantes y desconéctalo. También utiliza un servicio en la nube como Google Drive o iCloud para respaldos automáticos.',
  },
  {
    id: 'c-mitm',
    icono: 'wifi_password',
    titulo: 'Contra Ataques de Intermediario',
    contenido:
      'Evita usar redes Wi-Fi públicas para transacciones sensibles. Si debes usarlas, utiliza siempre una VPN confiable. Verifica que los sitios que visites usen HTTPS (el candado en la barra de dirección). No ignores las advertencias de certificado de tu navegador.',
    ejemploPractico:
      'Instala una VPN como ProtonVPN (tiene versión gratuita) en tu teléfono. Cada vez que te conectes a una red pública como la de un café o aeropuerto, activa la VPN antes de revisar tu correo o banco.',
  },
  {
    id: 'c-ddos',
    icono: 'shield',
    titulo: 'Mitigación de Ataques DDoS',
    contenido:
      'Como usuario individual, los ataques DDoS no te afectan directamente. Sin embargo, si administras un servidor o sitio web, usa servicios de protección como Cloudflare. Configura límites de velocidad y filtra el tráfico sospechoso. Mantén un plan de respuesta ante incidentes.',
    ejemploPractico:
      'Si tienes un sitio web, regístralo en Cloudflare de forma gratuita. Su red actúa como intermediario y filtra el tráfico malicioso antes de que llegue a tu servidor.',
  },
  {
    id: 'c-sqli',
    icono: 'database',
    titulo: 'Prevención de Inyección SQL',
    contenido:
      'Como desarrollador, usa siempre consultas parametrizadas o prepared statements. Nunca construyas consultas SQL concatenando directamente la entrada del usuario. Valida y sanitiza todos los datos de entrada. Aplica el principio de mínimo privilegio a las cuentas de base de datos.',
    ejemploPractico:
      'En lugar de escribir query = "SELECT * FROM users WHERE name = " + userName, usa consultas preparadas: query = "SELECT * FROM users WHERE name = ?", y pasa el valor por separado. Esto hace imposible la inyección SQL.',
  },
];

//  Estadísticas del dashboard 
const ESTADISTICAS = [
  { valor: '273.000', etiqueta: 'Ataques por día en el mundo', icono: 'bolt' },
  { valor: '131%', etiqueta: 'Crecimiento de ataques de malware por email en el 2025', icono: 'email' },
  { valor: '+90M', etiqueta: 'Intentos de Ciberataques al año en Colombia', icono: 'attach_money' },
  { valor: '32%', etiqueta: 'Cantidad de ataques cibernéticos que corresponden a phishing en Colombia.', icono: 'trending_up' },
];

// Componente principal 
export default function Amenazas() {
  const [activeTab, setActiveTab] = useState<'tipos' | 'consejos'>('tipos');
  const [openCard, setOpenCard] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleCard = (id: string) => {
    setOpenCard(prev => (prev === id ? null : id));
  };

  return (
    <div className="amenazas-page">
      <Navbar />

      {/* Hero */}
      <header className="amenazas-hero">
        <h1 className="amenazas-hero__title">
          Tipos de Amenazas y cómo protegerse
        </h1>
        <p className="amenazas-hero__subtitle">
          Conoce las amenazas y aprende a protegerte. Explora descripciones
          detalladas, ejemplos prácticos y consejos de prevención para fortalecer
          tu seguridad digital.
        </p>
      </header>

      {/* Dashboard de estadísticas */}
      <section className="amenazas-dashboard">
        {ESTADISTICAS.map(stat => (
          <div key={stat.etiqueta} className="stat-card">
            <span className="material-symbols-outlined stat-card__icon">
              {stat.icono}
            </span>
            <span className="stat-card__valor">{stat.valor}</span>
            <span className="stat-card__etiqueta">{stat.etiqueta}</span>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <div className="amenazas-tabs">
        <button
          className={`amenazas-tab ${activeTab === 'tipos' ? 'amenazas-tab--active' : ''}`}
          onClick={() => setActiveTab('tipos')}
        >
          Tipos de Amenazas
        </button>
        <button
          className={`amenazas-tab ${activeTab === 'consejos' ? 'amenazas-tab--active' : ''}`}
          onClick={() => setActiveTab('consejos')}
        >
          Consejos y cómo prevenirse
        </button>
      </div>

      {/* Contenido según tab abierto */}
      <main className="amenazas-content">

        {/* Tab 1: Tipos de amenazas */}
        {activeTab === 'tipos' && (
            <div className="amenazas-lista">
                {AMENAZAS.map(amenaza => (
            <div
        key={amenaza.id}
        className={`amenaza-card ${openCard === amenaza.id ? 'amenaza-card--open' : ''}`}
      >
        <button
          className="amenaza-card__header amenaza-card__header--btn"
          onClick={() => toggleCard(amenaza.id)}
        >
          <div className="amenaza-card__titulo-group">
            <span className="material-symbols-outlined amenaza-card__icon">
              {amenaza.icono}
            </span>
            <h2 className="amenaza-card__nombre">{amenaza.nombre}</h2>
          </div>
          <span className="material-symbols-outlined amenaza-card__chevron">
            {openCard === amenaza.id ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {openCard === amenaza.id && (
          <div className="amenaza-card__body">
  <p className="amenaza-card__desc">{amenaza.descripcion}</p>
  <div className="amenaza-card__ejemplo">
    <span className="material-symbols-outlined">lightbulb</span>
    <div>
      <strong>Ejemplo Práctico</strong>
      <p>{amenaza.ejemploPractico}</p>
    </div>
  </div>
</div>
        )}
      </div>
    ))}
  </div>
)}

        {/* Tab 2: Consejos y cómo prevenirse */}
        {activeTab === 'consejos' && (
          <div className="consejos-lista">
            {CONSEJOS.map(consejo => (
              <div
                key={consejo.id}
                className={`consejo-card ${openCard === consejo.id ? 'consejo-card--open' : ''}`}
              >
                <button
                  className="consejo-card__header"
                  onClick={() => toggleCard(consejo.id)}
                >
                  <div className="consejo-card__titulo-group">
                    <span className="material-symbols-outlined consejo-card__icon">
                      {consejo.icono}
                    </span>
                    <span className="consejo-card__titulo">{consejo.titulo}</span>
                  </div>
                  <span className="material-symbols-outlined consejo-card__chevron">
                    {openCard === consejo.id ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {openCard === consejo.id && (
                  <div className="consejo-card__body">
                    <p>{consejo.contenido}</p>
                    <div className="consejo-card__ejemplo">
                      <span className="material-symbols-outlined">lightbulb</span>
                      <div>
                        <strong>Ejemplo Práctico</strong>
                        <p>{consejo.ejemploPractico}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}