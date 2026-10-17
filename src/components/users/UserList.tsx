import type { User } from '../../types/user';
import { UserCard } from './UserCard';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

/**
 * Рендер списка через map.
 * key={user.id} — стабильный уникальный идентификатор: по нему React
 * сопоставляет элементы между рендерами и при удалении/сортировке
 * перемещает существующие карточки, а не пересоздаёт их.
 * Индекс массива в качестве key здесь не подходит — порядок меняется.
 */
export function UserList({ users, onEdit, onDelete }: UserListProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <li key={user.id} className="*:h-full">
          <UserCard user={user} onEdit={onEdit} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
