import { memo, type ReactNode } from 'react';
import { GENDER_LABELS } from '../../constants/labels';
import type { User } from '../../types/user';
import { formatDate, pluralizeYears } from '../../utils/date';
import { getFullName } from '../../utils/filterUsers';
import { Avatar } from '../ui/Avatar';
import { BriefcaseIcon, CakeIcon, MailIcon, MapPinIcon, PencilIcon, PhoneIcon, TrashIcon } from '../ui/Icons';
import { RoleBadge } from '../ui/RoleBadge';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

function InfoRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 min-w-0">
      <span className="shrink-0 text-base-content/40">{icon}</span>
      <span className="truncate">{children}</span>
    </li>
  );
}

/**
 * Карточка пользователя — «глупый» (presentational) компонент:
 * получает данные через props и сообщает о действиях через колбэки,
 * собственного состояния не имеет.
 *
 * memo: карточка перерисуется только если изменились её props.
 * Это работает, потому что onEdit/onDelete стабильны (useCallback в App),
 * а у неизменённых пользователей сохраняется та же ссылка на объект.
 */
export const UserCard = memo(function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const fullName = getFullName(user);
  const location = [user.address.city, user.address.country].filter(Boolean).join(', ');
  const job = [user.company.title, user.company.name].filter(Boolean).join(' · ');

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="card-body gap-4 p-5">
        <header className="flex items-start gap-4">
          <Avatar src={user.image} name={fullName} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="card-title truncate text-base leading-tight">{fullName}</h2>
            <p className="truncate text-sm text-base-content/60">@{user.username}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <RoleBadge role={user.role} />
              <span className="badge badge-ghost badge-sm">{GENDER_LABELS[user.gender]}</span>
              <span className="badge badge-ghost badge-sm">{pluralizeYears(user.age)}</span>
            </div>
          </div>
        </header>

        <ul className="space-y-1.5 text-sm">
          <InfoRow icon={<MailIcon />}>
            <a href={`mailto:${user.email}`} className="link link-hover">
              {user.email}
            </a>
          </InfoRow>
          <InfoRow icon={<PhoneIcon />}>
            <a href={`tel:${user.phone.replace(/[^\d+]/g, '')}`} className="link link-hover">
              {user.phone}
            </a>
          </InfoRow>
          <InfoRow icon={<CakeIcon />}>{formatDate(user.birthDate)}</InfoRow>
          {/* Необязательные поля показываем, только если они заполнены */}
          {location && <InfoRow icon={<MapPinIcon />}>{location}</InfoRow>}
          {job && <InfoRow icon={<BriefcaseIcon />}>{job}</InfoRow>}
        </ul>

        <div className="card-actions mt-auto justify-end border-t border-base-200 pt-3">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(user)}>
            <PencilIcon />
            Изменить
          </button>
          <button type="button" className="btn btn-ghost btn-sm text-error" onClick={() => onDelete(user)}>
            <TrashIcon />
            Удалить
          </button>
        </div>
      </div>
    </article>
  );
});
