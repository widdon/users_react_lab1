import { useEffect, useState } from 'react';

/**
 * Возвращает значение с задержкой: обновляется, только когда value
 * не менялся delay миллисекунд. Используется для поиска, чтобы не
 * фильтровать список на каждое нажатие клавиши.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    // cleanup: если value изменился раньше, чем истёк таймер, — отменяем старый
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
