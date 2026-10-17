import { useMemo } from 'react';
import type { User } from '../../types/user';

interface UserStatsProps {
  users: User[];
}

/** Сводка по всем пользователям. Пересчитывается только при изменении списка (useMemo). */
export function UserStats({ users }: UserStatsProps) {
  const stats = useMemo(() => {
    const total = users.length;
    const female = users.filter((u) => u.gender === 'female').length;
    const staff = users.filter((u) => u.role !== 'user').length;
    const avgAge = total ? Math.round(users.reduce((sum, u) => sum + u.age, 0) / total) : 0;
    return { total, female, male: total - female, staff, avgAge };
  }, [users]);

  return (
    <div className="stats stats-vertical w-full border border-base-300 bg-base-100 shadow-sm sm:stats-horizontal">
      <div className="stat">
        <div className="stat-title">Всего</div>
        <div className="stat-value">{stats.total}</div>
        <div className="stat-desc">пользователей в справочнике</div>
      </div>
      <div className="stat">
        <div className="stat-title">Средний возраст</div>
        <div className="stat-value">{stats.total ? stats.avgAge : '—'}</div>
        <div className="stat-desc">полных лет</div>
      </div>
      <div className="stat">
        <div className="stat-title">Женщины / мужчины</div>
        <div className="stat-value">
          {stats.female} / {stats.male}
        </div>
        <div className="stat-desc">по полю gender</div>
      </div>
      <div className="stat">
        <div className="stat-title">Администрация</div>
        <div className="stat-value text-primary">{stats.staff}</div>
        <div className="stat-desc">администраторы и модераторы</div>
      </div>
    </div>
  );
}
