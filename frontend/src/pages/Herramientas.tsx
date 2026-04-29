import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
// Util centralizado de validación — misma lógica que se usa en el formulario de registro
import { validatePassword, getPasswordRequirements } from '../utils/passwordValidator';
import '../styles/Herramientas.css';


// Identificadores de las tres pestañas disponibles en la página
type Tab = 'validador' | 'generador' | 'encriptador';


// ─────────────────────────────────────────────────────────────────────────────
// UTILIDAD: Generador de contraseñas aleatorias
// Construye un pool de caracteres según las opciones activas y elige
// posiciones al azar para cada carácter de la longitud solicitada.
// ─────────────────────────────────────────────────────────────────────────────
function generarPassword(longitud: number, opciones: {
  mayusculas: boolean;
  minusculas: boolean;
  numeros: boolean;
  simbolos: boolean;
}): string {
  let chars = '';
  if (opciones.mayusculas) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opciones.minusculas) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (opciones.numeros)    chars += '0123456789';
  if (opciones.simbolos)   chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  // Fallback: si el usuario desmarcó todo, usa minúsculas por defecto
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  return Array.from({ length: longitud }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}


// ─────────────────────────────────────────────────────────────────────────────
// UTILIDAD: Cifrado AES-256-GCM con derivación de clave PBKDF2
//
// Flujo de encriptación:
//   1. Genera un salt aleatorio de 16 bytes (único por operación)
//   2. Deriva una clave AES-256 a partir de la clave del usuario con PBKDF2
//      (100 000 iteraciones + SHA-256 → resistente a fuerza bruta)
//   3. Genera un IV aleatorio de 12 bytes para AES-GCM
//   4. Cifra el texto plano
//   5. Concatena [salt | iv | cifrado] y codifica en Base64 para transporte
// ─────────────────────────────────────────────────────────────────────────────
async function encriptarAES(texto: string, clave: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(clave), { name: 'PBKDF2' }, false, ['deriveKey']
  );
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cifrado = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(texto));
  // Empaqueta salt + iv + datos cifrados en un único Uint8Array antes de codificar
  const resultado = new Uint8Array([...salt, ...iv, ...new Uint8Array(cifrado)]);
  return btoa(String.fromCharCode(...resultado));
}


// ─────────────────────────────────────────────────────────────────────────────
// UTILIDAD: Descifrado AES-256-GCM
//
// Proceso inverso al de encriptarAES:
//   1. Decodifica el Base64 y extrae los segmentos [salt | iv | datos]
//   2. Re-deriva la misma clave AES usando PBKDF2 + la clave del usuario
//   3. Descifra — si la clave es incorrecta, crypto.subtle.decrypt lanza error
// ─────────────────────────────────────────────────────────────────────────────
async function desencriptarAES(textoCifradoB64: string, clave: string): Promise<string> {
  const enc = new TextEncoder();
  const datos = Uint8Array.from(atob(textoCifradoB64), c => c.charCodeAt(0));
  // Los primeros 16 bytes son el salt, los siguientes 12 el IV, el resto son datos
  const salt  = datos.slice(0, 16);
  const iv    = datos.slice(16, 28);
  const data  = datos.slice(28);
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(clave), { name: 'PBKDF2' }, false, ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  const descifrado = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return new TextDecoder().decode(descifrado);
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: Tooltip genérico controlado por estado externo
// Se gestiona desde el padre con openId / setOpenId para que solo
// un tooltip esté visible a la vez en toda la página.
// ─────────────────────────────────────────────────────────────────────────────
function Tooltip({
  texto, id, openId, setOpenId,
}: {
  texto: string;
  id: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  const visible = openId === id;
  return (
    <span className="tooltip-wrap">
      <button
        className="tooltip-btn"
        onClick={() => setOpenId(visible ? null : id)}
        aria-label="Más información"
        type="button"
      >
        ?
      </button>
      {visible && (
        <div className="tooltip-popup">
          <button className="tooltip-cerrar" onClick={() => setOpenId(null)} type="button">✕</button>
          <p>{texto}</p>
        </div>
      )}
    </span>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: ValidadorFortaleza
// Replica exactamente la lógica visual de PasswordStrength.tsx del registro,
// usando el mismo util (validatePassword / getPasswordRequirements) para
// que el usuario reciba el mismo feedback que verá al crear su cuenta.
// ─────────────────────────────────────────────────────────────────────────────
function ValidadorFortaleza({ password }: { password: string }) {
  // No renderiza nada hasta que el usuario empiece a escribir
  if (!password) return null;

  // strength: { label, color, percentage, score, feedback }
  // requirements: array de { text, met, hasError }
  const strength     = validatePassword(password);
  const requirements = getPasswordRequirements(password);

  // Devuelve el ícono correcto según el estado de cada requisito:
  //   hasError → XCircle rojo  |  met → CheckCircle verde  |  pendiente → Circle gris
  const getReqIcon = (req: { met: boolean; hasError?: boolean }) => {
    if (req.hasError) return <XCircle size={16} className="req-icon req-icon--error" />;
    if (req.met)      return <CheckCircle2 size={16} className="req-icon req-icon--ok" />;
    return <Circle size={16} className="req-icon req-icon--pending" />;
  };

  return (
    <div className="fortaleza-resultado">

      {/* Cabecera: etiqueta "Fortaleza" + valor dinámico coloreado (ej: "Débil" en naranja) */}
      <div className="fortaleza-header">
        <span className="fortaleza-label-text">Fortaleza</span>
        <span className="fortaleza-label-valor" style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>

      {/* Barra de progreso: width y color vienen directamente del util — transición CSS suaviza el cambio */}
      <div className="fortaleza-barra-wrap">
        <div
          className="fortaleza-barra-fill"
          style={{
            width: `${strength.percentage}%`,
            backgroundColor: strength.color,
          }}
        />
      </div>

      {/* Advertencia de zxcvbn si la contraseña tiene un patrón reconocible (ej: "asd123") */}
      {strength.feedback?.warning && (
        <p className="fortaleza-consejo">
          <strong>Advertencia:</strong> {strength.feedback.warning}
        </p>
      )}
      {/* Primera sugerencia de mejora que devuelve zxcvbn (si existe y no hay advertencia) */}
      {strength.feedback?.suggestions && strength.feedback.suggestions.length > 0 && (
        <p className="fortaleza-consejo">
          <strong>Sugerencia:</strong> {strength.feedback.suggestions[0]}
        </p>
      )}

      {/* Lista de requisitos mínimos del proyecto (longitud, mayúsculas, números, etc.) */}
      <div className="requisitos-password">
        <h3 className="requisitos-title">Requisitos de contraseña segura</h3>
        <div className="requisitos-grid">
          {requirements.map((req, i) => (
            <div
              key={i}
              className={`requisito-item ${
                req.hasError ? 'requisito-item--error' : req.met ? 'requisito-item--ok' : ''
              }`}
            >
              {getReqIcon(req)}
              <span>{req.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL: Herramientas
// Agrupa tres herramientas de seguridad bajo un sistema de pestañas:
//   1. Validador  — evalúa contraseñas existentes
//   2. Generador  — crea contraseñas aleatorias configurables
//   3. Encriptador — cifra/descifra texto con AES-256-GCM
// ─────────────────────────────────────────────────────────────────────────────
export default function Herramientas() {
  // Pestaña activa — controla qué panel se renderiza
  const [activeTab, setActiveTab] = useState<Tab>('validador');

  // ── Estado: Validador ──
  const [password, setPassword]       = useState('');
  const [mostrarPass, setMostrarPass] = useState(false); // toggle visibilidad contraseña

  // ── Estado: Generador ──
  const [longitud, setLongitud]         = useState(16);         // longitud del slider (8-32)
  const [passGenerada, setPassGenerada] = useState('');         // resultado generado
  const [copiado, setCopiado]           = useState(false);      // feedback visual "Copiado"
  const [opcionesGen, setOpcionesGen]   = useState({
    mayusculas: true,
    minusculas: true,
    numeros: true,
    simbolos: false, // desactivado por defecto para mayor compatibilidad
  });

  // ── Estado: Encriptador AES-256 ──
  const [textoPlano, setTextoPlano]     = useState('');
  const [textoCifrado, setTextoCifrado] = useState('');
  const [claveAES, setClaveAES]         = useState('');
  const [modo, setModo]                 = useState<'encriptar' | 'desencriptar'>('encriptar');
  const [resultadoAES, setResultadoAES] = useState('');
  const [errorAES, setErrorAES]         = useState('');
  const [copiadoAES, setCopiadoAES]     = useState(false);
  const [mostrarClave, setMostrarClave] = useState(false);
  // Control de tooltip: solo un tooltip abierto a la vez en toda la página
  const [openTooltip, setOpenTooltip]   = useState<string | null>(null);

  // Scroll al top al montar la página — mejora UX al navegar desde otras rutas
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Copia la contraseña generada al portapapeles y muestra feedback 2 segundos
  const copiarPassword = () => {
    navigator.clipboard.writeText(passGenerada);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Alterna un checkbox del generador sin mutar el estado anterior
  const toggleOpcion = (key: keyof typeof opcionesGen) => {
    setOpcionesGen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="herramientas-page">
      {/* Navbar compartido con el resto del sitio */}
      <Navbar />

      {/* Hero informativo — describe el propósito de la página */}
      <header className="herramientas-hero">
        <h1 className="herramientas-hero__title">Herramientas de Protección</h1>
        <p className="herramientas-hero__subtitle">
          Utiliza nuestras herramientas integradas para mejorar tu seguridad digital.
          Valida la fortaleza de tus contraseñas, genera nuevas y encripta información sensible.
        </p>
      </header>

      {/* Navegación por pestañas */}
      <div className="herramientas-tabs-container">
        <div className="herramientas-tabs">
          {([
            { id: 'validador',   label: 'Validador de Contraseñas' },
            { id: 'generador',   label: 'Generador de Contraseñas' },
            { id: 'encriptador', label: 'Encriptador AES-256'      },
          ] as { id: Tab; label: string }[]).map(tab => (
            <button
              key={tab.id}
              className={`herramientas-tab ${activeTab === tab.id ? 'herramientas-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="herramientas-content">

        {/* PESTAÑA 1: Validador de Contraseñas - Misma lógica del formulario de registro.
             */}
        {activeTab === 'validador' && (
          <div className="herramienta-panel">
            <h2 className="panel-title">Validador de Fortaleza de Contraseña</h2>
            <p className="panel-subtitle">
              Evalúa tu contraseña con las mismas reglas del registro y revisa qué requisitos te faltan.
            </p>

            {/* Input con toggle show/hide — igual al campo de contraseña del registro */}
            <div className="input-group">
              <input
                type={mostrarPass ? 'text' : 'password'}
                className="herramienta-input"
                placeholder="Escribe tu contraseña aquí"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button className="input-toggle" onClick={() => setMostrarPass(p => !p)} type="button">
                <span className="material-symbols-outlined">
                  {mostrarPass ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {/* Renderiza barra + requisitos solo si hay texto — ver componente arriba */}
            <ValidadorFortaleza password={password} />
          </div>
        )}

        {/* PESTAÑA 2: Generador de Contraseñas */}
        {activeTab === 'generador' && (
          <div className="herramienta-panel">
            <h2 className="panel-title">Generador de Contraseñas Seguras</h2>
            <p className="panel-subtitle">Crea contraseñas robustas y aprende sobre sus principios de seguridad.</p>

            {/* Paso 1: Slider de longitud (8–32 caracteres) */}
            <div className="paso-card">
              <h3 className="paso-titulo">
                <span className="paso-numero">1</span>
                Paso 1: Elige la Longitud
              </h3>
              <p className="paso-desc">Una contraseña más larga es significativamente más difícil de adivinar. Recomendamos al menos 12 caracteres.</p>
              <div className="slider-wrap">
                <input
                  type="range" min={8} max={32} value={longitud}
                  onChange={e => setLongitud(Number(e.target.value))}
                  className="slider"
                />
                <span className="slider-valor">{longitud}</span>
              </div>
              <p className="paso-hint">Cuantos más caracteres, más segura será. ¡Experimenta!</p>
            </div>

            {/* Paso 2: Checkboxes de tipos de caracteres */}
            <div className="paso-card">
              <h3 className="paso-titulo">
                <span className="paso-numero">2</span>
                Paso 2: Incluye Tipos de Caracteres
              </h3>
              <p className="paso-desc">Combinar diferentes tipos de caracteres aumenta exponencialmente la seguridad.</p>
              <div className="opciones-grid">
                {([
                  { key: 'mayusculas', label: 'Mayúsculas (A-Z)' },
                  { key: 'minusculas', label: 'Minúsculas (a-z)' },
                  { key: 'numeros',    label: 'Números (0-9)'    },
                  { key: 'simbolos',   label: 'Símbolos (!@#$%)' },
                ] as { key: keyof typeof opcionesGen; label: string }[]).map(op => (
                  <label key={op.key} className="opcion-check">
                    <input
                      type="checkbox"
                      checked={opcionesGen[op.key]}
                      onChange={() => toggleOpcion(op.key)}
                    />
                    {op.label}
                  </label>
                ))}
              </div>
              <p className="paso-hint">Activa al menos tres tipos para una contraseña verdaderamente fuerte.</p>
            </div>

            {/* Paso 3: Botón generar + campo de resultado + botón copiar */}
            <div className="paso-card">
              <h3 className="paso-titulo">
                <span className="paso-numero">3</span>
                Paso 3: Generar y Usar
              </h3>
              <p className="paso-desc">¡Ya estás listo! Genera tu contraseña y cópiala de forma segura.</p>
              <div className="generar-wrap">
                <input
                  type="text" className="herramienta-input"
                  value={passGenerada} readOnly
                  placeholder="Tu contraseña aparecerá aquí"
                />
                <button
                  className="btn-generar" type="button"
                  onClick={() => {
                    // Valida que al menos un tipo de carácter esté seleccionado
                    const hayAlguno = Object.values(opcionesGen).some(v => v);
                    if (!hayAlguno) { alert('Selecciona al menos un tipo de caracter.'); return; }
                    setPassGenerada(generarPassword(longitud, opcionesGen));
                  }}
                >
                  Generar
                </button>
              </div>
              {/* Botón copiar — solo visible una vez generada la contraseña */}
              {passGenerada && (
                <button className="btn-copiar" onClick={copiarPassword} type="button">
                  {copiado ? '✓ Copiado' : 'Copiar Contraseña'}
                </button>
              )}
              <p className="paso-hint">Guarda tu contraseña en un gestor de contraseñas de confianza.</p>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: Encriptador AES-256-GCM - Todo el procesamiento ocurre en el navegador (Web Crypto API).*/}
        {activeTab === 'encriptador' && (
          <div className="herramienta-panel">
            <h2 className="panel-title">Encriptador de Texto AES-256</h2>
            <p className="panel-subtitle">
              Encripta cualquier texto con una clave secreta. Solo quien tenga esa clave
              podrá desencriptarlo. Usa AES-256-GCM, el estándar de cifrado más robusto.
            </p>

            {/* Selector de modo: Encriptar / Desencriptar — resetea resultado y error al cambiar */}
            <div className="aes-modo-wrap">
              <button
                className={`aes-modo-btn ${modo === 'encriptar' ? 'aes-modo-btn--active' : ''}`}
                onClick={() => { setModo('encriptar'); setResultadoAES(''); setErrorAES(''); }}
                type="button"
              >
                <span className="material-symbols-outlined aes-modo-icon">lock</span>
                Encriptar
              </button>
              <button
                className={`aes-modo-btn ${modo === 'desencriptar' ? 'aes-modo-btn--active' : ''}`}
                onClick={() => { setModo('desencriptar'); setResultadoAES(''); setErrorAES(''); }}
                type="button"
              >
                <span className="material-symbols-outlined aes-modo-icon">lock_open</span>
                Desencriptar
              </button>
            </div>

            {/* Grid de dos columnas: izquierda (inputs + acción) | derecha (resultado + info) */}
            <div className="encriptador-grid">
              <div className="encriptador-izq">
                {/* Textarea dinámica: en modo encriptar recibe texto plano, en modo desencriptar recibe Base64 */}
                <label className="campo-label">
                  {modo === 'encriptar' ? 'Texto a encriptar' : 'Texto cifrado (pega aquí)'}
                </label>
                <textarea
                  className="herramienta-textarea"
                  placeholder={
                    modo === 'encriptar'
                      ? 'Escribe el texto que quieres proteger...'
                      : 'Pega aquí el texto cifrado que recibiste...'
                  }
                  value={modo === 'encriptar' ? textoPlano : textoCifrado}
                  onChange={e =>
                    modo === 'encriptar'
                      ? setTextoPlano(e.target.value)
                      : setTextoCifrado(e.target.value)
                  }
                />

                {/* Campo de clave secreta con tooltip explicativo y toggle show/hide */}
                <label className="campo-label">
                  Clave secreta
                  <Tooltip
                    texto="La clave secreta es la contraseña que protege tu texto. Sin ella, nadie puede desencriptarlo. Usa una clave larga y difícil de adivinar, y guárdala en un lugar seguro."
                    id="clave-aes"
                    openId={openTooltip}
                    setOpenId={setOpenTooltip}
                  />
                </label>
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <input
                    type={mostrarClave ? 'text' : 'password'}
                    className="herramienta-input"
                    placeholder="Escribe tu clave secreta..."
                    value={claveAES}
                    onChange={e => setClaveAES(e.target.value)}
                  />
                  <button className="input-toggle" onClick={() => setMostrarClave(p => !p)} type="button">
                    <span className="material-symbols-outlined">
                      {mostrarClave ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Botón principal de acción — llama a encriptarAES o desencriptarAES según el modo */}
                <button
                  className="btn-generar"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  type="button"
                  onClick={async () => {
                    setErrorAES('');
                    setResultadoAES('');
                    const entrada = modo === 'encriptar' ? textoPlano : textoCifrado;
                    if (!entrada.trim()) return setErrorAES('Escribe el texto primero.');
                    if (!claveAES.trim()) return setErrorAES('Necesitas una clave secreta.');
                    try {
                      if (modo === 'encriptar') {
                        setResultadoAES(await encriptarAES(entrada, claveAES));
                      } else {
                        setResultadoAES(await desencriptarAES(entrada, claveAES));
                      }
                    } catch {
                      // Si desencriptar falla, casi siempre es clave incorrecta o texto corrupto
                      setErrorAES(
                        modo === 'desencriptar'
                          ? 'No se pudo desencriptar. Verifica que la clave sea correcta.'
                          : 'Ocurrió un error al encriptar.'
                      );
                    }
                  }}
                >
                  {modo === 'encriptar' ? (
                    <><span className="material-symbols-outlined aes-modo-icon">lock</span> Encriptar texto</>
                  ) : (
                    <><span className="material-symbols-outlined aes-modo-icon">lock_open</span> Desencriptar texto</>
                  )}
                </button>

                {/* Mensaje de error inline — visible solo si ocurrió un problema */}
                {errorAES && <p className="aes-error">{errorAES}</p>}
              </div>

              {/* Columna derecha: resultado + botón copiar + explicación contextual */}
              <div className="encriptador-der">
                <div className="hash-header">
                  <label className="campo-label">
                    {modo === 'encriptar' ? 'Texto cifrado' : 'Texto descifrado'}
                  </label>
                  {/* Botón copiar — solo aparece cuando hay un resultado disponible */}
                  {resultadoAES && (
                    <button
                      className="btn-copiar-inline" type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(resultadoAES);
                        setCopiadoAES(true);
                        setTimeout(() => setCopiadoAES(false), 2000);
                      }}
                    >
                      {copiadoAES ? '✓ Copiado' : '⧉ Copiar'}
                    </button>
                  )}
                </div>

                {/* Área de resultado en monospace verde — placeholder si aún no se procesó */}
                <div className="hash-resultado" style={{ minHeight: '160px', wordBreak: 'break-all' }}>
                  {resultadoAES || (
                    <span className="hash-placeholder">
                      {modo === 'encriptar'
                        ? 'El texto cifrado aparecerá aquí...'
                        : 'El texto original aparecerá aquí...'}
                    </span>
                  )}
                </div>

                {/* Explicación educativa — cambia según el modo activo */}
                <div className="hash-info">
                  <h4>¿Cómo funciona?</h4>
                  <p>
                    {modo === 'encriptar'
                      ? 'AES-256-GCM convierte tu texto en datos ilegibles usando tu clave. Sin esa clave exacta, nadie puede recuperar el contenido original. Guarda el texto cifrado y la clave por separado.'
                      : 'Para desencriptar necesitas el texto cifrado completo y la misma clave con la que fue encriptado. Si la clave es incorrecta, la operación fallará.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer compartido con el resto del sitio */}
      <Footer />
    </div>
  );
}