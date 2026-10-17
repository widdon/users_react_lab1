import type { UserFilters } from '../types/filters';
import type { User } from '../types/user';

export const DEFAULT_FILTERS: UserFilters = {
  query: '',
  gender: 'all',
  role: 'all',
  sort: 'name',
};

export function getFullName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`;
}

function matchesQuery(user: User, query: string): boolean {
  if (!query) return true;
  const haystack = [getFullName(user), user.username, user.email, user.address.city, user.company.name]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

/** Чистая функция: не меняет исходный массив, возвращает новый. */
export function filterUsers(users: User[], filters: UserFilters): User[] {
  const query = filters.query.trim().toLowerCase();

  const result = users.filter(
    (user) =>
      matchesQuery(user, query) &&
      (filters.gender === 'all' || user.gender === filters.gender) &&
      (filters.role === 'all' || user.role === filters.role),
  );

  switch (filters.sort) {
    case 'name':
      return result.sort((a, b) => getFullName(a).localeCompare(getFullName(b)));
    case 'age-asc':
      return result.sort((a, b) => a.age - b.age);
    case 'age-desc':
      return result.sort((a, b) => b.age - a.age);
    case 'newest':
      return result.sort((a, b) => b.id - a.id);
  }
}

export function isDefaultFilters(filters: UserFilters): boolean {
  return (
    filters.query === DEFAULT_FILTERS.query &&
    filters.gender === DEFAULT_FILTERS.gender &&
    filters.role === DEFAULT_FILTERS.role
  );
}
