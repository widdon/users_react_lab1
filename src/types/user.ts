/**
 * Модель пользователя.
 * Структура повторяет формат https://dummyjson.com/docs/users,
 * но содержит только ту часть полей, которая нужна интерфейсу.
 */

export type Gender = 'male' | 'female';

export type UserRole = 'admin' | 'moderator' | 'user';

export interface Address {
  address: string;
  city: string;
  country: string;
}

export interface Company {
  name: string;
  department: string;
  title: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  email: string;
  phone: string;
  username: string;
  birthDate: string; // YYYY-MM-DD
  image: string;
  role: UserRole;
  address: Address;
  company: Company;
}

/** Данные пользователя без id — то, что приходит из формы при создании/изменении. */
export type UserDraft = Omit<User, 'id'>;

/** Формат ответа GET https://dummyjson.com/users */
export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
