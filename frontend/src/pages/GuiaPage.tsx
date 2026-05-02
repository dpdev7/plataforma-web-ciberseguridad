import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, Clock } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/guia.css';

const API_BASE =
  import.meta.env.VITE_API_URL ?? 'https://backend-web-ciberseguridad.onrender.com';

type PasoGuia = {
  titulo: string;
  contenido: string;
  imagen?: string;
};

type Guia = {
  id: number;
  titulo: string;
  categoria: string;
  tiempoLectura: number;
  descripcion: string;
  pasos: PasoGuia[];
};

export default function GuiaPage() {
  const { id } = useParams<{ id: string }>();
  const guiaId = useMemo(() => Number(id), [id]);

  const [guia, setGuia] = useState<Guia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pasoActivo, setPasoActivo] = useState(0);
  const [completados, setCompletados] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchGuia = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!Number.isFinite(guiaId)) {
          throw new Error('ID inválido');
        }

        const res = await fetch(`${API_BASE}/guia/obtener/${guiaId}/`);
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();
        const raw = data?.result ?? data;

        const mapped: Guia = {
          id: Number(raw.id ?? raw.guia_id ?? guiaId),
          titulo: String(raw.titulo ?? 'Guía sin título'),
          categoria: String(raw.categoria?.nombre ?? raw.categoria ?? 'General'),
          tiempoLectura: Number(raw.tiempo_lectura ?? raw.tiempoLectura ?? 0),
          descripcion: String(raw.descripcion ?? ''),
          pasos: Array.isArray(raw.pasos)
            ? raw.pasos.map((p: any) => ({
                titulo: String(p.titulo ?? 'Paso'),
                contenido: String(p.contenido ?? ''),
                imagen: p.imagen ?? p.imagen_url ?? undefined,
              }))
            : [],
        };

        if (!cancelled) {
          setGuia(mapped);
          setPasoActivo(0);
          setCompletados([]);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? 'No se pudo cargar la guía');
          setGuia(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchGuia();

    return () => {
      cancelled = true;
    };
  }, [guiaId]);

  const avanzar = () => {
    if (!guia) return;
    if (!completados.includes(pasoActivo)) {
      setCompletados((prev) => [...prev, pasoActivo]);
    }
    if (pasoActivo < guia.pasos.length - 1) {
      setPasoActivo((prev) => prev + 1);
    }
  };

  const retroceder = () => {
    if (pasoActivo > 0) setPasoActivo((prev) => prev - 1);
  };

  if (loading) {
    return (
      <div className="guia-page">
        <Navbar />
        <div className="guia-notfound__body">
          <p>Cargando guía…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !guia || guia.pasos.length === 0) {
    return (
      <div className="guia-notfound">
        <Navbar />
        <div className="guia-notfound__body">
          <p>Guía no encontrada.</p>
          {error && <small>{error}</small>}
          <Link to="/biblioteca" className="btn-back">
            ← Volver a la Biblioteca
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const paso = guia.pasos[pasoActivo];
  const esUltimo = pasoActivo === guia.pasos.length - 1;

  return (
    <div className="guia-page">
      <Navbar />

      <div className="guia__layout">
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
              const activo = pasoActivo === i;

              return (
                <button
                  key={i}
                  type="button"
                  className={`guia__step ${activo ? 'guia__step--active' : ''} ${
                    completado ? 'guia__step--done' : ''
                  }`}
                  onClick={() => setPasoActivo(i)}
                >
                  <span className="guia__step-icon">
                    {completado ? <CheckCircle size={14} /> : <Circle size={14} />}
                  </span>
                  <span className="guia__step-label">{p.titulo}</span>
                  {activo && <span className="guia__step-badge">Actual</span>}
                  {!activo && !completado && (
                    <span className="guia__step-pending">Pendiente</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

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
            <h2 className="guia__paso-titulo">{paso.titulo}</h2>

            {paso.imagen && (
              <div className="guia__paso-img">
                <img src={paso.imagen} alt={paso.titulo} />
              </div>
            )}

            <div className="guia__paso-body">
              {paso.contenido.split('\n').map((linea, i) => {
                const text = linea.trim();
                if (!text) return null;

                if (text.startsWith('- ')) {
                  return <li key={i}>{text.slice(2)}</li>;
                }

                if (text.startsWith('**') && text.endsWith('**')) {
                  return (
                    <h3 key={i} className="guia__paso-subtitulo">
                      {text.replace(/\*\*/g, '')}
                    </h3>
                  );
                }

                return (
                  <p key={i}>
                    {text.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </p>
                );
              })}
            </div>
          </article>

          <div className="guia__nav">
            <button
              type="button"
              className="btn-guia btn-guia--ghost"
              onClick={retroceder}
              disabled={pasoActivo === 0}
            >
              ← Anterior
            </button>

            <button
              type="button"
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