import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Тема оформления DaisyUI: хранится в localStorage и выставляется в <html data-theme>. */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('users-app:theme', getSystemTheme);

  // Побочный эффект — изменение DOM вне React-дерева
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  return { theme, toggleTheme };
}
