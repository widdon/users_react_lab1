import type { ReactNode } from 'react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

/** Диалог подтверждения опасного действия (удаление, сброс данных). */
export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onClose }: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="text-base-content/80">{message}</div>
      <div className="modal-action">
        {/* По умолчанию фокус на «Отмена», чтобы Enter случайно ничего не удалил */}
        <button type="button" className="btn btn-ghost" onClick={onClose} autoFocus>
          Отмена
        </button>
        <button type="button" className="btn btn-error" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
