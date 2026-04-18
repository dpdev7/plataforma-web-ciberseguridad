import { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import type { Cuestionario } from '../../../types/adminContent';

interface Props {
  onClose:   () => void;
  onConfirm: (data: Omit<Cuestionario, 'id'>) => void;
}

export default function CuestionarioCreateModal({ onClose, onConfirm }: Props) {
  const [form, setForm] = useState({
    titulo:       '',
    descripcion:  '',
    tiempoLimite: 0,
    esActivo:     true,
  });

  const set = (key: string, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__header-left">
            <span className="icon-wrap icon-wrap--md"><HelpCircle size={16} /></span>
            <h2 className="modal__title">Nuevo cuestionario</h2>
          </div>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          <div className="form-group">
            <label>Título</label>
            <input className="form-input" placeholder="Título del cuestionario"
              value={form.titulo} onChange={e => set('titulo', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea className="form-input form-textarea" placeholder="Descripción breve"
              value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tiempo límite (minutos) — 0 = sin límite</label>
            <input className="form-input" type="number" min={0}
              value={form.tiempoLimite}
              onChange={e => set('tiempoLimite', Number(e.target.value))} />
          </div>
          <div className="form-group form-group--row">
            <label>Activo</label>
            <input type="checkbox" checked={form.esActivo}
              onChange={e => set('esActivo', e.target.checked)} />
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn--primary"
            onClick={() => onConfirm(form)} disabled={!form.titulo.trim()}>
            Crear cuestionario
          </button>
        </div>
      </div>
    </div>
  );
}