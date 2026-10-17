import { useCallback, useMemo, useState } from 'react';
import { Header } from './components/layout/Header';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { EmptyState } from './components/ui/EmptyState';
import { FilterXIcon, PlusIcon, RotateIcon, SearchIcon, UsersIcon } from './components/ui/Icons';
import { Toast } from './components/ui/Toast';
import { UserFormModal } from './components/users/UserFormModal';
import { UserList } from './components/users/UserList';
import { UserListSkeleton } from './components/users/UserListSkeleton';
import { UserStats } from './components/users/UserStats';
import { UserToolbar } from './components/users/UserToolbar';
import { useDebounce } from './hooks/useDebounce';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { useUsers } from './hooks/useUsers';
import type { UserFilters } from './types/filters';
import type { User, UserDraft } from './types/user';
import { DEFAULT_FILTERS, filterUsers, getFullName, isDefaultFilters } from './utils/filterUsers';

/**
 * Какое модальное окно открыто. Размеченное объединение (discriminated union)
 * не позволяет попасть в некорректное состояние — например, «редактирование»
 * без выбранного пользователя.
 */
type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; user: User }
  | { type: 'delete'; user: User }
  | { type: 'reset' };

const CLOSED: ModalState = { type: 'closed' };

/**
 * Корневой «умный» компонент: владеет состоянием и передаёт его вниз через props,
 * а изменения получает обратно через колбэки (одностороннее связывание).
 */
export default function App() {
  const { users, status, addUser, updateUser, deleteUser, resetUsers } = useUsers();
  const { theme, toggleTheme } = useTheme();
  const { toast, showToast, hideToast } = useToast();

  const [filters, setFilters] = useState<UserFilters>(DEFAULT_FILTERS);
  const [modal, setModal] = useState<ModalState>(CLOSED);

  // Поиск применяется с задержкой, а поле ввода обновляется мгновенно
  const debouncedQuery = useDebounce(filters.query, 250);
  const { gender, role, sort } = filters;

  // Пересчитываем отфильтрованный список, только когда изменились его входные данные
  const visibleUsers = useMemo(
    () => filterUsers(users, { query: debouncedQuery, gender, role, sort }),
    [users, debouncedQuery, gender, role, sort],
  );

  // --- обработчики фильтров ---

  const handleFiltersChange = useCallback((patch: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters((prev) => ({ ...DEFAULT_FILTERS, sort: prev.sort }));
  }, []);

  // --- обработчики модальных окон ---
  // useCallback нужен, чтобы ссылки на функции не менялись между рендерами:
  // тогда memo(UserCard) не перерисовывает карточки без необходимости.

  const openCreate = useCallback(() => setModal({ type: 'create' }), []);
  const openEdit = useCallback((user: User) => setModal({ type: 'edit', user }), []);
  const openDelete = useCallback((user: User) => setModal({ type: 'delete', user }), []);
  const openReset = useCallback(() => setModal({ type: 'reset' }), []);
  const closeModal = useCallback(() => setModal(CLOSED), []);

  // --- действия с данными ---

  const handleFormSubmit = (draft: UserDraft) => {
    if (modal.type === 'edit') {
      updateUser(modal.user.id, draft);
      showToast(`Изменения сохранены: ${getFullName(draft)}`);
    } else {
      addUser(draft);
      showToast(`Пользователь ${getFullName(draft)} добавлен`);
    }
    closeModal();
  };

  const handleConfirmDelete = (user: User) => {
    deleteUser(user.id);
    showToast(`Пользователь ${getFullName(user)} удалён`, 'info');
    closeModal();
  };

  const handleConfirmReset = () => {
    resetUsers();
    setFilters(DEFAULT_FILTERS);
    showToast('Данные возвращены к исходным', 'info');
    closeModal();
  };

  // --- условный рендеринг основного содержимого ---

  const renderContent = () => {
    if (status === 'loading') return <UserListSkeleton />;

    if (status === 'error') {
      return (
        <EmptyState
          icon={<RotateIcon className="size-7" />}
          title="Не удалось загрузить пользователей"
          description="Проверьте подключение и попробуйте ещё раз."
        >
          <button type="button" className="btn btn-primary" onClick={resetUsers}>
            Повторить
          </button>
        </EmptyState>
      );
    }

    if (users.length === 0) {
      return (
        <EmptyState
          icon={<UsersIcon className="size-7" />}
          title="Список пользователей пуст"
          description="Добавьте первого пользователя или верните исходные данные."
        >
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <PlusIcon />
            Добавить пользователя
          </button>
          <button type="button" className="btn btn-ghost" onClick={openReset}>
            <RotateIcon />
            Вернуть исходные
          </button>
        </EmptyState>
      );
    }

    if (visibleUsers.length === 0) {
      return (
        <EmptyState
          icon={<SearchIcon className="size-7" />}
          title="Никого не нашли"
          description="Попробуйте изменить запрос или сбросить фильтры."
        >
          <button type="button" className="btn btn-ghost" onClick={handleResetFilters}>
            <FilterXIcon />
            Сбросить фильтры
          </button>
        </EmptyState>
      );
    }

    return <UserList users={visibleUsers} onEdit={openEdit} onDelete={openDelete} />;
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header theme={theme} onToggleTheme={toggleTheme} onResetData={openReset} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold">Пользователи</h1>
          <p className="text-base-content/60">Просмотр, добавление, редактирование и удаление учётных записей</p>
        </div>

        <UserStats users={users} />

        <UserToolbar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onResetFilters={handleResetFilters}
          canResetFilters={!isDefaultFilters(filters)}
          onCreate={openCreate}
          shownCount={visibleUsers.length}
          totalCount={users.length}
        />

        {renderContent()}
      </main>

      {/* Модальные окна: рендерятся только когда нужны */}
      {(modal.type === 'create' || modal.type === 'edit') && (
        <UserFormModal
          user={modal.type === 'edit' ? modal.user : null}
          users={users}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
        />
      )}

      {modal.type === 'delete' && (
        <ConfirmDialog
          title="Удалить пользователя?"
          message={
            <>
              Пользователь <b>{getFullName(modal.user)}</b> (@{modal.user.username}) будет удалён без возможности
              восстановления.
            </>
          }
          confirmLabel="Удалить"
          onConfirm={() => handleConfirmDelete(modal.user)}
          onClose={closeModal}
        />
      )}

      {modal.type === 'reset' && (
        <ConfirmDialog
          title="Вернуть исходные данные?"
          message="Все добавленные, изменённые и удалённые записи будут сброшены к начальному списку."
          confirmLabel="Сбросить"
          onConfirm={handleConfirmReset}
          onClose={closeModal}
        />
      )}

      {toast && <Toast key={toast.id} toast={toast} onClose={hideToast} />}
    </div>
  );
}
