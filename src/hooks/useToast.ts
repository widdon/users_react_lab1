import { useCallback, useEffect, useRef, useState } from 'react';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

/**
 * Всплывающее уведомление, которое само скрывается через duration мс.
 *
 * id таймера хранится в useRef, а не в useState: его изменение не должно
 * вызывать ререндер, но значение должно сохраняться между рендерами.
 */
export function useToast(duration = 3000) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const hideToast = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      window.clearTimeout(timerRef.current);
      setToast({ id: Date.now(), message, type });
      timerRef.current = window.setTimeout(() => setToast(null), duration);
    },
    [duration],
  );

  // при размонтировании не оставляем «висящий» таймер
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { toast, showToast, hideToast };
}
