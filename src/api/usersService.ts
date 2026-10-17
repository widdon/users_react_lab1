import { MOCK_USERS_RESPONSE } from '../data/mockUsers';
import type { User, UsersResponse } from '../types/user';
import { normalizeDate } from '../utils/date';

/**
 * Слой доступа к данным.
 *
 * Сейчас данные берутся из мока, но интерфейс сервиса повторяет API dummyjson.
 * Чтобы перейти на реальный бэкенд, достаточно заменить тело fetchUsers на:
 *
 *   const res = await fetch('https://dummyjson.com/users?limit=0');
 *   const data: UsersResponse = await res.json();
 *
 * Компоненты и хуки при этом менять не придётся.
 */

const MOCK_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Приводит пользователя из API к виду, удобному интерфейсу. */
function normalizeUser(user: User): User {
  return { ...user, birthDate: normalizeDate(user.birthDate) };
}

export async function fetchUsers(): Promise<User[]> {
  await delay(MOCK_DELAY_MS); // имитация сетевой задержки
  const data: UsersResponse = structuredClone(MOCK_USERS_RESPONSE);
  return data.users.map(normalizeUser);
}
