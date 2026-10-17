import { useCallback, useEffect, useState } from 'react';
import { fetchUsers } from '../api/usersService';
import type { User, UserDraft } from '../types/user';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'users-app:users';
const EMPTY: User[] = [];

export type LoadStatus = 'loading' | 'ready' | 'error';

/**
 * Единственный источник правды о списке пользователей.
 * Компоненты получают отсюда данные и функции для их изменения —
 * сами они состояние списка не хранят.
 */
export function useUsers() {
  // null — данных ещё нет (первый запуск или после сброса), нужно загрузить
  const [users, setUsers] = useLocalStorage<User[] | null>(STORAGE_KEY, null);
  const [status, setStatus] = useState<LoadStatus>(users === null ? 'loading' : 'ready');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (users !== null) return;

    let cancelled = false;

    fetchUsers()
      .then((data) => {
        if (cancelled) return;
        setUsers(data);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    // cleanup: если компонент размонтирован до ответа, результат игнорируем
    return () => {
      cancelled = true;
    };
  }, [users, reloadKey, setUsers]);

  // Все изменения — через функциональный апдейтер setUsers(prev => ...):
  // так мы всегда работаем с актуальным состоянием, а сами колбэки
  // не зависят от users и остаются стабильными между рендерами (useCallback).

  const addUser = useCallback(
    (draft: UserDraft) => {
      setUsers((prev) => {
        const list = prev ?? [];
        const nextId = list.reduce((max, u) => Math.max(max, u.id), 0) + 1;
        return [...list, { ...draft, id: nextId }];
      });
    },
    [setUsers],
  );

  const updateUser = useCallback(
    (id: number, draft: UserDraft) => {
      setUsers((prev) => prev?.map((u) => (u.id === id ? { ...draft, id } : u)) ?? prev);
    },
    [setUsers],
  );

  const deleteUser = useCallback(
    (id: number) => {
      setUsers((prev) => prev?.filter((u) => u.id !== id) ?? prev);
    },
    [setUsers],
  );

  /** Сбросить все изменения и заново загрузить исходные данные. */
  const resetUsers = useCallback(() => {
    setStatus('loading');
    setUsers(null);
    setReloadKey((k) => k + 1);
  }, [setUsers]);

  return {
    users: users ?? EMPTY,
    status,
    addUser,
    updateUser,
    deleteUser,
    resetUsers,
  };
}
