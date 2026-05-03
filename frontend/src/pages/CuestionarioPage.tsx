import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/cuestionario.css';
import { API_BACKEND } from '../utils/api';

// Tipos locales alineados con la respuesta del backend
interface OpcionAPI {
  opcion_id:         string;
  texto:             string;
  es_correcta:       boolean;
  retroalimentacion: string | null;
}

interface PreguntaAPI {
  pregunta_id: string;
  enunciado:   string;
  puntos:      number;
  opciones:    OpcionAPI[];
}

interface CuestionarioAPI {
  cuestionario_id:       string;
  titulo:                string;
  descripcion:           string;
  es_activo:             boolean;
  tiempo_limite_minutos: number;
  preguntas:             PreguntaAPI[];
}

export default function CuestionarioPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cuestionario, setCuestionario] = useState<CuestionarioAPI | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  const [preguntaIdx,  setPreguntaIdx]  = useState(0);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [respuestas,   setRespuestas]   = useState<Record<string, string>>({}); // preguntaId → opcionId

  // Fetch del cuestionario por ID
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    // Trae todos y filtra el que coincide con el UUID del id
    fetch(`${API_BACKEND}/cuestionario/obtener/all/`)
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data: any) => {
        const encontrado = data.result.find((c: CuestionarioAPI) =>
          c.cuestionario_id === id
        );
        if (!encontrado) throw new Error('Cuestionario no encontrado');
        setCuestionario(encontrado);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Estados de carga
  if (loading) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="quiz__wrapper">
          <div className="quiz__card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Cargando cuestionario…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !cuestionario) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="quiz__wrapper">
          <div className="quiz__card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {error ?? 'Cuestionario no encontrado.'}
            </p>
            <Link to="/biblioteca" className="quiz__btn-siguiente" style={{ textDecoration: 'none' }}>
              ← Volver a la Biblioteca
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const preguntas = cuestionario.preguntas;
  const pregunta  = preguntas[preguntaIdx];
  const total     = preguntas.length;
  const progreso  = ((preguntaIdx + 1) / total) * 100;
  const esUltima  = preguntaIdx === total - 1;

  const handleSiguiente = () => {
    if (!seleccionada) return;

    const nuevasRespuestas = { ...respuestas, [pregunta.pregunta_id]: seleccionada };
    setRespuestas(nuevasRespuestas);

    if (esUltima) {
      navigate(`/biblioteca/cuestionario/${id}/resultados`, {
        state: {
          respuestas: nuevasRespuestas,
          preguntas,
          titulo: cuestionario.titulo,
        },
      });
    } else {
      setPreguntaIdx(prev => prev + 1);
      setSeleccionada(null);
    }
  };

  return (
    <div className="quiz-page">
      <Navbar />

      <div className="quiz__wrapper">
        <div className="quiz__card">

          {/* Header */}
          <div className="quiz__card-header">
            <Link to="/biblioteca" className="quiz__back">
              <ArrowLeft size={14} /> Biblioteca
            </Link>
            <h2 className="quiz__titulo">{cuestionario.titulo}</h2>
            <p className="quiz__desc">{cuestionario.descripcion}</p>
          </div>

          {/* Barra de progreso */}
          <div className="quiz__progress">
            <div className="quiz__progress-label">
              <span>Pregunta {preguntaIdx + 1} de {total}</span>
              <span>{Math.round(progreso)}%</span>
            </div>
            <div className="quiz__progress-track">
              <div className="quiz__progress-fill" style={{ width: `${progreso}%` }} />
            </div>
          </div>

          {/* Pregunta */}
          <div className="quiz__pregunta">
            <p className="quiz__enunciado">{pregunta.enunciado}</p>
            <div className="quiz__opciones">
              {pregunta.opciones.map(op => (
                <button
                  key={op.opcion_id}
                  className={`quiz__opcion ${seleccionada === op.opcion_id ? 'quiz__opcion--selected' : ''}`}
                  onClick={() => setSeleccionada(op.opcion_id)}
                >
                  <span className="quiz__opcion-radio" />
                  <span className="quiz__opcion-texto">{op.texto}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="quiz__footer">
            <button
              className="quiz__btn-siguiente"
              disabled={!seleccionada}
              onClick={handleSiguiente}
            >
              {esUltima ? 'Ver resultados' : 'Siguiente'} →
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}