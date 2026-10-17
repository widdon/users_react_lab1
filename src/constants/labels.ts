import type { SortOption } from '../types/filters';
import type { Gender, UserRole } from '../types/user';

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Мужской',
  female: 'Женский',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Администратор',
  moderator: 'Модератор',
  user: 'Пользователь',
};

export const SORT_LABELS: Record<SortOption, string> = {
  name: 'По имени (А–Я)',
  'age-asc': 'Сначала младше',
  'age-desc': 'Сначала старше',
  newest: 'Сначала новые',
};

export const GENDERS = Object.keys(GENDER_LABELS) as Gender[];
export const ROLES = Object.keys(ROLE_LABELS) as UserRole[];
export const SORT_OPTIONS = Object.keys(SORT_LABELS) as SortOption[];
