import type { Gender, UserRole } from './user';

export type SortOption = 'name' | 'age-asc' | 'age-desc' | 'newest';

export interface UserFilters {
  query: string;
  gender: Gender | 'all';
  role: UserRole | 'all';
  sort: SortOption;
}
