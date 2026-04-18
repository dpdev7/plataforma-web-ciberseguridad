import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, ShieldCheck, RotateCcw, BookOpen } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/cuestionario.css';

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

interface ResultadosState {
  respuestas: Record<string, string>; // preguntaId → opcionId
  preguntas:  PreguntaAPI[];
  titulo:     string;
}

export default function ResultadosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state    = location.state as ResultadosState | null;

  if (!state) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="quiz__wrapper">
          <div className="quiz__card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No hay resultados disponibles.</p>
            <Link to="/biblioteca" className="quiz__btn-siguiente" style={{ textDecoration: 'none' }}>
              Ir a la Biblioteca
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { respuestas, preguntas, titulo } = state;

  const correctas  = preguntas.filter(p =>
    p.opciones.find(o => o.opcion_id === respuestas[p.pregunta_id])?.es_correcta ?? false
  ).length;
  const total      = preguntas.length;
  const fallos     = total - correctas;
  const porcentaje = Math.round((correctas / total) * 100);

  const getMensaje = () => {
    if (porcentaje === 100) return { texto: '¡Perfecto! Eres un experto 🏆',         color: '#4ade80' };
    if (porcentaje >= 80)  return { texto: '¡Muy bien! Sigue así 💪',               color: '#4ade80' };
    if (porcentaje >= 60)  return { texto: '¡Buen intento! Sigue practicando 📖',    color: '#facc15' };
    return                        { texto: 'Necesitas repasar este tema 📚',          color: '#f87171' };
  };

  const mensaje = getMensaje();

  return (
    <div className="quiz-page">
      <Navbar />
      <div className="quiz__wrapper quiz__wrapper--results">

        <div className="quiz__card results__card">
          <h2 className="results__titulo" style={{ color: mensaje.color }}>{mensaje.texto}</h2>
          <p className="results__subtitulo">Has completado el cuestionario de <strong>{titulo}</strong>.</p>

          <div className="results__badges">
            <span className="results__badge results__badge--correct"><CheckCircle size={14} /> Correctas: {correctas}</span>
            <span className="results__badge results__badge--wrong"><XCircle size={14} /> Fallos: {fallos}</span>
          </div>

          <div className="results__score-wrap">
            <ShieldCheck size={80} className="results__shield" style={{ color: mensaje.color }} />
            <p className="results__score-label">Tu Puntuación Final</p>
            <p className="results__score" style={{ color: mensaje.color }}>{porcentaje}%</p>
          </div>

          <div className="results__actions">
            <button className="results__btn results__btn--retry" onClick={() => navigate(-1)}>
              <RotateCcw size={14} /> Volver a Intentar
            </button>
            <button
              className="results__btn results__btn--detail"
              onClick={() => document.getElementById('detalle')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BookOpen size={14} /> Ver Detalle
            </button>
          </div>

          <Link to="/biblioteca" className="results__link-biblioteca">← Explorar más cuestionarios</Link>
        </div>

        {/* Detalle por pregunta */}
        <div id="detalle" className="results__detalle">
          <h3 className="results__detalle-titulo">Revisión detallada</h3>
          {preguntas.map((p, i) => {
            const opcionElegida  = p.opciones.find(o => o.opcion_id === respuestas[p.pregunta_id]);
            const opcionCorrecta = p.opciones.find(o => o.es_correcta);
            const acerto         = opcionElegida?.es_correcta ?? false;

            return (
              <div key={p.pregunta_id} className={`results__item ${acerto ? 'results__item--ok' : 'results__item--fail'}`}>
                <div className="results__item-header">
                  <span className="results__item-num">Pregunta {i + 1}</span>
                  {acerto
                    ? <CheckCircle size={16} className="results__item-icon results__item-icon--ok" />
                    : <XCircle    size={16} className="results__item-icon results__item-icon--fail" />
                  }
                </div>
                <p className="results__item-enunciado">{p.enunciado}</p>
                <p className="results__item-respuesta">
                  <span className="results__item-label">Tu respuesta:</span>
                  <span className={acerto ? 'results__text--ok' : 'results__text--fail'}>
                    {opcionElegida?.texto ?? '—'}
                  </span>
                </p>
                {!acerto && (
                  <p className="results__item-respuesta">
                    <span className="results__item-label">Respuesta correcta:</span>
                    <span className="results__text--ok">{opcionCorrecta?.texto}</span>
                  </p>
                )}
                {opcionElegida?.retroalimentacion && (
                  <p className="results__feedback">{opcionElegida.retroalimentacion}</p>
                )}
              </div>
            );
          })}
        </div>

      </div>
      <Footer />
    </div>
  );
}