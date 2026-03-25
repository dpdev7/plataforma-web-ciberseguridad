import { useState, useEffect } from 'react';

import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary as esDictionary, translations as esTranslations } from '@zxcvbn-ts/language-es-es';
import { dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/Herramientas.css';

zxcvbnOptions.setOptions({
  translations: esTranslations,
  dictionary: {
    ...commonDictionary,
    ...esDictionary,
  },
});

// Componente principal 
type Tab = 'validador' | 'generador' | 'encriptador';

// Validador de fortaleza de contraseñas
function evaluarFortaleza(password: string) {
  if (!password) return { nivel: 'muy-debil' as const, etiqueta: '', porcentaje: 0, consejo: '' };

  const resultado = zxcvbn(password);
  const score = resultado.score; // 0-4

  const niveles = [
    { nivel: 'muy-debil' as const, etiqueta: 'Muy Débil', porcentaje: 20  },
    { nivel: 'debil'     as const, etiqueta: 'Débil',     porcentaje: 40  },
    { nivel: 'debil'     as const, etiqueta: 'Débil',     porcentaje: 40  },
    { nivel: 'buena'     as const, etiqueta: 'Buena',     porcentaje: 70  },
    { nivel: 'fuerte'    as const, etiqueta: 'Fuerte',    porcentaje: 100 },
  ];

  const consejos: Record<number, string> = {
    0: 'Contraseña muy fácil de adivinar. Agrégale longitud, números y símbolos.',
    1: 'Contraseña débil. Evita palabras comunes o secuencias predecibles.',
    2: 'Contraseña débil. Evita palabras comunes o secuencias predecibles.',
    3: 'Buen trabajo, agrega símbolos o más caracteres para hacerla más fuerte.',
    4: '¡Excelente! Tu contraseña es muy segura.',
  };

  return {
    ...niveles[score],
    consejo: consejos[score],
  };
}

// Generador de contraseñas
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
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  return Array.from({ length: longitud }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

// Encriptador de texto con Web Crypto API
async function generarHash(texto: string, algoritmo: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest(algoritmo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Componente de tooltip para información adicional
function Tooltip({ texto, id, openId, setOpenId }: { 
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
      >
        ?
      </button>
      {visible && (
        <div className="tooltip-popup">
          <button className="tooltip-cerrar" onClick={() => setOpenId(null)}>✕</button>
          <p>{texto}</p>
        </div>
      )}
    </span>
  );
}

export default function Herramientas() {
  const [activeTab, setActiveTab] = useState<Tab>('validador');

  // Validador
  const [password, setPassword]       = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const fortaleza = evaluarFortaleza(password);

  // Generador
  const [longitud, setLongitud]           = useState(16);
  const [passGenerada, setPassGenerada]   = useState('');
  const [copiado, setCopiado]             = useState(false);
  const [opcionesGen, setOpcionesGen]     = useState({
    mayusculas: true,
    minusculas: true,
    numeros: true,
    simbolos: false,
  });

  // Encriptador
  const [textoHash, setTextoHash]     = useState('');
  const [algoritmo, setAlgoritmo]     = useState('SHA-256');
  const [hashResult, setHashResult] = useState('');
  const [copiadoHash, setCopiadoHash] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const copiarPassword = () => {
    navigator.clipboard.writeText(passGenerada);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const copiarHash = () => {
    navigator.clipboard.writeText(hashResult);
    setCopiadoHash(true);
    setTimeout(() => setCopiadoHash(false), 2000);
  };

  const toggleOpcion = (key: keyof typeof opcionesGen) => {
    setOpcionesGen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="herramientas-page">
      <Navbar />

      {/* Hero */}
      <header className="herramientas-hero">
        <h1 className="herramientas-hero__title">Herramientas de Protección</h1>
        <p className="herramientas-hero__subtitle">
          Utiliza nuestras herramientas integradas para mejorar tu seguridad digital.
          Valida la fortaleza de tus contraseñas, genera nuevas y encripta información sensible.
        </p>
      </header>

      {/* Pestañas */}
      <div className="herramientas-tabs">
        {([
          { id: 'validador',   label: 'Validador de Contraseñas' },
          { id: 'generador',   label: 'Generador de Contraseñas' },
          { id: 'encriptador', label: 'Encriptador de Texto'     },
        ] as { id: Tab; label: string }[]).map(tab => (
          <button
            key={tab.id}
            className={`herramientas-tab ${activeTab === tab.id ? 'herramientas-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="herramientas-content">

        {/* Pestaña Validador */}
        {activeTab === 'validador' && (
          <div className="herramienta-panel">
            <h2 className="panel-title">Validador de Fortaleza de Contraseña</h2>
            <p className="panel-subtitle">Ingresa una contraseña para evaluar su seguridad.</p>

            <div className="input-group">
              <input
                type={mostrarPass ? 'text' : 'password'}
                className="herramienta-input"
                placeholder="Escribe tu contraseña aquí"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button className="input-toggle" onClick={() => setMostrarPass(p => !p)}>
                <span className="material-symbols-outlined">
                  {mostrarPass ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {password && (
              <div className="fortaleza-resultado">
                <div className="barras-fortaleza">
                  {(['muy-debil', 'debil', 'buena', 'fuerte'] as const).map(nivel => (
                    <div key={nivel} className="barra-wrap">
                      <div className={`barra ${nivel} ${
                        (['muy-debil', 'debil', 'buena', 'fuerte'].indexOf(fortaleza.nivel) >=
                         ['muy-debil', 'debil', 'buena', 'fuerte'].indexOf(nivel))
                          ? 'barra--activa' : ''
                      }`} />
                      <span className="barra-label">
                        {nivel === 'muy-debil' ? 'Muy Débil' :
                         nivel === 'debil'     ? 'Débil'     :
                         nivel === 'buena'     ? 'Buena'     : 'Fuerte'}
                      </span>
                    </div>
                  ))}
                </div>
                {fortaleza.consejo && (
                  <p className="fortaleza-consejo">
                    <strong>Consejo:</strong> {fortaleza.consejo}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pestaña Generador */}
        {activeTab === 'generador' && (
          <div className="herramienta-panel">
            <h2 className="panel-title">Generador de Contraseñas Seguras</h2>
            <p className="panel-subtitle">Crea contraseñas robustas y aprende sobre sus principios de seguridad.</p>

            <div className="paso-card">
              <h3 className="paso-titulo">
                <span className="paso-numero">1</span>
                Paso 1: Elige la Longitud
              </h3>
              <p className="paso-desc">Una contraseña más larga es significativamente más difícil de adivinar. Recomendamos al menos 12 caracteres.</p>
              <div className="slider-wrap">
                <input
                  type="range"
                  min={8} max={32}
                  value={longitud}
                  onChange={e => setLongitud(Number(e.target.value))}
                  className="slider"
                />
                <span className="slider-valor">{longitud}</span>
              </div>
              <p className="paso-hint">Cuantos más caracteres, más segura será. ¡Experimenta!</p>
            </div>

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

            <div className="paso-card">
              <h3 className="paso-titulo">
                <span className="paso-numero">3</span>
                Paso 3: Generar y Usar
              </h3>
              <p className="paso-desc">¡Ya estás listo! Genera tu contraseña y cópiala de forma segura.</p>
              <div className="generar-wrap">
                <input
                  type="text"
                  className="herramienta-input"
                  value={passGenerada}
                  readOnly
                  placeholder="Tu contraseña aparecerá aquí"
                />
                <button
                    className="btn-generar"
                    onClick={() => {
                        const hayAlguno = Object.values(opcionesGen).some(v => v);
                        if (!hayAlguno) {
                            alert('Selecciona al menos un tipo de caracter.');
                            return;
                        }
                        setPassGenerada(generarPassword(longitud, opcionesGen));
                    }}
                >
                    Generar
                </button>
              </div>
              {passGenerada && (
                <button className="btn-copiar" onClick={copiarPassword}>
                  {copiado ? '✓ Copiado' : 'Copiar Contraseña'}
                </button>
              )}
              <p className="paso-hint">Guarda tu contraseña en un gestor de contraseñas de confianza.</p>
            </div>
          </div>
        )}

        {/* Pestaña Encriptador */}
        {activeTab === 'encriptador' && (
          <div className="herramienta-panel">
            <h2 className="panel-title">Generador de Hash de Texto</h2>
            <p className="panel-subtitle">
              Introduce un texto para generar un hash seguro usando el algoritmo que elijas.
              Esta es una herramienta educativa y no debe usarse para información sensible.
            </p>

            <div className="encriptador-grid">
              <div className="encriptador-izq">
                <label className="campo-label">Texto a encriptar</label>
                <textarea
                  className="herramienta-textarea"
                  placeholder="Escribe aquí tu texto..."
                  value={textoHash}
                  onChange={e => setTextoHash(e.target.value)}
                />
                <label className="campo-label">
                    Clave Secreta (Salt - Opcional)
                    <Tooltip
                        texto="El salt es un valor aleatorio que se combina con tu texto antes de generar el hash. 
                        Evita que dos textos iguales produzcan el mismo hash, protegiéndote contra ataques de tablas predefinidas."
                        id="salt"
                        openId={openTooltip}
                        setOpenId={setOpenTooltip}
                    />
                </label>
                    <input
                    type="text"
                    className="herramienta-input"
                    placeholder="Introduce una clave secreta"
                    style={{ marginBottom: '16px' }}
                />
                <label className="campo-label">
                    Selecciona un Algoritmo
                    <Tooltip
                        texto="Un algoritmo de hash convierte cualquier texto en una huella digital de longitud fija. 
                        SHA-256 es el más usado y equilibrado. SHA-512 es más seguro pero más lento."
                        id="algoritmo"
                        openId={openTooltip}
                        setOpenId={setOpenTooltip}
                    />
                </label>
                <select
                  className="herramienta-select"
                  value={algoritmo}
                  onChange={e => setAlgoritmo(e.target.value)}
                >
                  <option>SHA-256</option>
                  <option>SHA-512</option>
                </select>
                <div className="encriptador-botones">
                    <button className="btn-generar" onClick={() => {
                        if (!textoHash) return;
                        const algoMap: Record<string, string> = {
                            'SHA-256': 'SHA-256',
                            'SHA-512': 'SHA-512',
                        };
                        generarHash(textoHash, algoMap[algoritmo]).then(setHashResult);
                    }}>
                        Generar Hash
                    </button>
                    </div>
                </div>

              <div className="encriptador-der">
                <div className="hash-header">
                  <label className="campo-label">Hash Generado ({algoritmo})</label>
                  {hashResult && (
                    <button className="btn-copiar-inline" onClick={copiarHash}>
                      {copiadoHash ? '✓ Copiado' : '⧉ Copiar'}
                    </button>
                  )}
                </div>
                <div className="hash-resultado">
                  {hashResult || <span className="hash-placeholder">El hash aparecerá aquí...</span>}
                </div>
                <div className="hash-info">
                  <h4>¿Qué es este hash?</h4>
                  <p>Un hash es una representación de longitud fija de tus datos. Es un proceso de un solo sentido: no puedes recuperar el texto original a partir del hash. 
                    Se utiliza comúnmente para verificar la integridad de los datos y para almacenar contraseñas de forma segura.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}