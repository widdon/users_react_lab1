import { useEffect, useRef } from 'react';
import { GENDERS, GENDER_LABELS, ROLES, ROLE_LABELS, SORT_LABELS, SORT_OPTIONS } from '../../constants/labels';
import type { SortOption, UserFilters } from '../../types/filters';
import type { Gender, UserRole } from '../../types/user';
import { FilterXIcon, PlusIcon, SearchIcon } from '../ui/Icons';

interface UserToolbarProps {
  filters: UserFilters;
  onFiltersChange: (patch: Partial<UserFilters>) => void;
  onResetFilters: () => void;
  canResetFilters: boolean;
  onCreate: () => void;
  shownCount: number;
  totalCount: number;
}

/**
 * Панель поиска и фильтров. Полностью управляемый (controlled) компонент:
 * значения приходят из props, а изменения уходят наверх через onFiltersChange.
 * Состояние фильтров хранится в App — это одностороннее связывание.
 */
export function UserToolbar({
  filters,
  onFiltersChange,
  onResetFilters,
  canResetFilters,
  onCreate,
  shownCount,
  totalCount,
}: UserToolbarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  // Горячая клавиша «/» — фокус на поиск. Подписка на событие — побочный эффект,
  // поэтому useEffect; в cleanup обязательно отписываемся.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = target.closest('input, textarea, select, [contenteditable="true"]');
      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="input w-full lg:max-w-sm">
          <SearchIcon className="size-4 opacity-50" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Имя, логин, email, город…"
            value={filters.query}
            onChange={(e) => onFiltersChange({ query: e.target.value })}
            aria-label="Поиск пользователей"
          />
          <kbd className="kbd kbd-sm">/</kbd>
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:flex-1">
          <select
            className="select w-full lg:w-auto"
            value={filters.gender}
            onChange={(e) => onFiltersChange({ gender: e.target.value as Gender | 'all' })}
            aria-label="Фильтр по полу"
          >
            <option value="all">Любой пол</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {GENDER_LABELS[g]}
              </option>
            ))}
          </select>

          <select
            className="select w-full lg:w-auto"
            value={filters.role}
            onChange={(e) => onFiltersChange({ role: e.target.value as UserRole | 'all' })}
            aria-label="Фильтр по роли"
          >
            <option value="all">Все роли</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>

          <select
            className="select w-full lg:w-auto"
            value={filters.sort}
            onChange={(e) => onFiltersChange({ sort: e.target.value as SortOption })}
            aria-label="Сортировка"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {SORT_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="btn btn-primary lg:ml-auto" onClick={onCreate}>
          <PlusIcon />
          Добавить
        </button>
      </div>

      <div className="mt-3 flex min-h-8 items-center justify-between gap-2 text-sm text-base-content/60">
        <span>
          Показано <b className="text-base-content">{shownCount}</b> из {totalCount}
        </span>
        {canResetFilters && (
          <button type="button" className="btn btn-ghost btn-xs" onClick={onResetFilters}>
            <FilterXIcon className="size-3.5" />
            Сбросить фильтры
          </button>
        )}
      </div>
    </section>
  );
}
