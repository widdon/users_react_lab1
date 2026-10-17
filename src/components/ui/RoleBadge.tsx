import { ROLE_LABELS } from '../../constants/labels';
import type { UserRole } from '../../types/user';

const ROLE_CLASSES: Record<UserRole, string> = {
  admin: 'badge-primary',
  moderator: 'badge-secondary',
  user: 'badge-info',
};

export function RoleBadge({ role }: { role: UserRole }) {
  return <span className={`badge badge-soft badge-sm ${ROLE_CLASSES[role]}`}>{ROLE_LABELS[role]}</span>;
}
