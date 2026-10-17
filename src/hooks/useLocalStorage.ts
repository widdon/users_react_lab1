import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

function readValue<T>(key: string, initialValue: T | (() => T)): T {
  const fallback = (): T =>
    typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback() : (JSON.parse(raw) as T);
  } catch {
    // повреждённые данные или запрет доступа к storage
    return fallback();
  }
}

/**
 * Кастомный хук: тот же useState, но значение переживает перезагрузку страницы.
 *
 * - начальное значение читается из localStorage один раз — через ленивую
 *   инициализацию useState(() => ...), а не на каждом рендере;
 * - при каждом изменении значения useEffect синхронизирует его обратно в storage.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readValue(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // переполнение квоты или приватный режим — работаем без сохранения
    }
  }, [key, value]);

  return [value, setValue];
}
