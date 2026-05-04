import { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { apiFetch } from '../../../utils/api';

interface Opcion {
  opcion_id: string;
  texto:     string;
  es_correcta: boolean;
}

interface Pregunta {
  pregunta_id: string;
  enunciado:   string;
  puntos:      number;
  opciones:    Opcion[];
}

interface Props {
  cuestionarioId:    string;
  cuestionarioTitulo: string;
  onClose:           () => void;
}



export default function CuestionarioPreguntasModal({ cuestionarioId, cuestionarioTitulo, onClose }: Props) {
  const [preguntas,      setPreguntas]      = useState<Pregunta[]>([]);
  const [loading,        setLoading]        = useState(false);

  // Form nueva pregunta
  const [nuevoEnunciado, setNuevoEnunciado] = useState('');
  const [nuevoPuntos,    setNuevoPuntos]    = useState(1);
  const [agregandoP,     setAgregandoP]     = useState(false);

  // Form nueva opción por pregunta
  const [opcionTexto,    setOpcionTexto]    = useState<Record<string, string>>({});
  const [opcionRetro,    setOpcionRetro]    = useState<Record<string, string>>({});
  const [agregandoO,     setAgregandoO]     = useState<Record<string, boolean>>({});

  // ── Fetch preguntas con opciones (usamos obtener/all que ya trae todo) ──
  const fetchPreguntas = async () => {
    setLoading(true);
    try {
 const data = await apiFetch('/cuestionario/obtener/all/');
      const cuest = data.result.find((c: any) => c.cuestionario_id === cuestionarioId);
      setPreguntas(cuest?.preguntas ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPreguntas(); }, []);

  // ── Crear pregunta ──
  const handleCrearPregunta = async () => {
    if (!nuevoEnunciado.trim()) return;
    setAgregandoP(true);
    try {
await apiFetch('/cuestionario/pregunta/crear/', {
  method: 'POST',
        body: JSON.stringify({
          enunciado:       nuevoEnunciado,
          puntos:          nuevoPuntos,
          cuestionario_id: cuestionarioId,
        }),
      });
      setNuevoEnunciado('');
      setNuevoPuntos(1);
      await fetchPreguntas();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAgregandoP(false);
    }
  };

  // ── Eliminar pregunta ──
  const handleEliminarPregunta = async (preguntaId: string) => {
    if (!confirm('¿Eliminar esta pregunta y todas sus opciones?')) return;
await apiFetch(`/cuestionario/pregunta/eliminar/${preguntaId}/`, { method: 'DELETE' });
    await fetchPreguntas();
  };

  // ── Crear opción ──
  const handleCrearOpcion = async (preguntaId: string, esCorrecta: boolean) => {
    const texto = opcionTexto[preguntaId]?.trim();
    if (!texto) return;
    setAgregandoO(prev => ({ ...prev, [preguntaId]: true }));
    try {
await apiFetch('/cuestionario/pregunta/opcion/crear/', {
  method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto,
          pregunta_id:      preguntaId,
          es_correcta:      esCorrecta,
          retroalimentacion: opcionRetro[preguntaId] ?? '',
        }),
      });
      setOpcionTexto(prev => ({ ...prev, [preguntaId]: '' }));
      setOpcionRetro(prev => ({ ...prev, [preguntaId]: '' }));
      await fetchPreguntas();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAgregandoO(prev => ({ ...prev, [preguntaId]: false }));
    }
  };

  // ── Eliminar opción ──
  const handleEliminarOpcion = async (opcionId: string) => {
    await apiFetch(`/cuestionario/pregunta/opcion/eliminar/${opcionId}/`, { method: 'DELETE' });
    await fetchPreguntas();
  };

  // ── Marcar opción como correcta ──
  const handleMarcarCorrecta = async (opcionId: string) => {
      await apiFetch(`/cuestionario/pregunta/opcion/editar/${opcionId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ es_correcta: true }),
    });
    await fetchPreguntas();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--xl" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__header-left">
            <h2 className="modal__title">Preguntas — {cuestionarioTitulo}</h2>
          </div>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>

          {/* ── Agregar pregunta ── */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 12 }}>
              Nueva pregunta
            </p>
            <div className="form-group">
              <label>Enunciado</label>
              <input className="form-input" placeholder="¿Cuál es...?"
                value={nuevoEnunciado} onChange={e => setNuevoEnunciado(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Puntos</label>
              <input className="form-input" type="number" min={1}
                value={nuevoPuntos} onChange={e => setNuevoPuntos(Number(e.target.value))} />
            </div>
            <button className="btn btn--primary btn--sm" onClick={handleCrearPregunta}
              disabled={!nuevoEnunciado.trim() || agregandoP}>
              <Plus size={13} /> Agregar pregunta
            </button>
          </div>

          {/* ── Lista de preguntas ── */}
          {loading ? (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Cargando…</p>
          ) : preguntas.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Sin preguntas aún.</p>
          ) : preguntas.map((p, idx) => (
            <div key={p.pregunta_id} style={{
              border: '1px solid var(--border)', borderRadius: 8,
              padding: 16, marginBottom: 16, background: 'var(--bg-card)'
            }}>
              {/* Cabecera pregunta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>
                    Pregunta {idx + 1} · {p.puntos} pt{p.puntos !== 1 ? 's' : ''}
                  </span>
                  <p style={{ margin: '4px 0 0', fontWeight: 600, color: '#f1f5f9' }}>{p.enunciado}</p>
                </div>
                <button className="btn btn--danger btn--sm" onClick={() => handleEliminarPregunta(p.pregunta_id)}>
                  <Trash2 size={12} />
                </button>
              </div>

              {/* Opciones existentes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {p.opciones.map(o => (
                  <div key={o.opcion_id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', borderRadius: 6,
                    background: o.es_correcta ? 'rgba(34,197,94,0.08)' : 'var(--bg-surface)',
                    border: `1px solid ${o.es_correcta ? 'rgba(34,197,94,0.3)' : 'var(--border-subtle)'}`,
                  }}>
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: o.es_correcta ? '#22c55e' : 'var(--text-dim)' }}
                      title={o.es_correcta ? 'Correcta' : 'Marcar como correcta'}
                      onClick={() => !o.es_correcta && handleMarcarCorrecta(o.opcion_id)}
                    >
                      {o.es_correcta ? <CheckCircle size={15} /> : <Circle size={15} />}
                    </button>
                    <span style={{ flex: 1, fontSize: 13, color: o.es_correcta ? '#86efac' : 'var(--text-primary)' }}>
                      {o.texto}
                    </span>
                    <button className="btn btn--danger btn--sm" style={{ padding: '2px 6px' }}
                      onClick={() => handleEliminarOpcion(o.opcion_id)}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Agregar opción */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input className="form-input" style={{ flex: 2, minWidth: 140 }}
                  placeholder="Texto de la opción"
                  value={opcionTexto[p.pregunta_id] ?? ''}
                  onChange={e => setOpcionTexto(prev => ({ ...prev, [p.pregunta_id]: e.target.value }))}
                />
                <input className="form-input" style={{ flex: 1, minWidth: 100 }}
                  placeholder="Retroalimentación (opcional)"
                  value={opcionRetro[p.pregunta_id] ?? ''}
                  onChange={e => setOpcionRetro(prev => ({ ...prev, [p.pregunta_id]: e.target.value }))}
                />
                <button className="btn btn--ghost btn--sm"
                  disabled={!opcionTexto[p.pregunta_id]?.trim() || agregandoO[p.pregunta_id]}
                  onClick={() => handleCrearOpcion(p.pregunta_id, false)}>
                  <Plus size={12} /> Incorrecta
                </button>
                <button className="btn btn--primary btn--sm"
                  disabled={!opcionTexto[p.pregunta_id]?.trim() || agregandoO[p.pregunta_id]}
                  onClick={() => handleCrearOpcion(p.pregunta_id, true)}>
                  <CheckCircle size={12} /> Correcta
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}