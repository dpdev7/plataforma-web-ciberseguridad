import { Trash2, X } from 'lucide-react';
import type { Recurso } from '../../../types/adminContent';

interface Props {
  recurso:   Recurso;
  onClose:   () => void;
  onConfirm: () => void;
}

export default function ContentDeleteModal({ recurso, onClose, onConfirm }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div className="modal__header-left">
            <span className="icon-wrap icon-wrap--md icon-wrap--danger">
              <Trash2 size={16} />
            </span>
            <h2 className="modal__title">Eliminar recurso</h2>
          </div>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          <p className="delete-confirm__text">
            ¿Estás seguro que deseas eliminar{' '}
            <strong>{recurso.titulo}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <p className="form-static">{recurso.tipo === 'guia' ? 'Guía' : 'Artículo'} · {recurso.categoria}</p>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn--danger" onClick={onConfirm}>Eliminar</button>
        </div>

      </div>
    </div>
  );
}