import type { ToastMessage, ToastType } from '../../hooks/useToast';
import { XIcon } from './Icons';

const ALERT_CLASSES: Record<ToastType, string> = {
  success: 'alert-success',
  info: 'alert-info',
  error: 'alert-error',
};

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  return (
    <div className="toast toast-end toast-bottom z-50">
      <div role="status" className={`alert ${ALERT_CLASSES[toast.type]} shadow-lg`}>
        <span>{toast.message}</span>
        <button type="button" className="btn btn-ghost btn-xs btn-circle" onClick={onClose} aria-label="Скрыть">
          <XIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
