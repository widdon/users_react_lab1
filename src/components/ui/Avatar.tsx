import { useState } from 'react';

interface AvatarProps {
  src: string;
  name: string;
  size?: 'md' | 'lg' | 'xl';
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  md: 'w-10 text-sm',
  lg: 'w-14 text-lg',
  xl: 'w-20 text-2xl',
};

// Полные имена классов перечислены явно, чтобы Tailwind их нашёл при сборке
const PLACEHOLDER_COLORS = [
  'bg-primary text-primary-content',
  'bg-secondary text-secondary-content',
  'bg-accent text-accent-content',
  'bg-info text-info-content',
  'bg-success text-success-content',
  'bg-warning text-warning-content',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

/** Детерминированный цвет: у одного и того же имени всегда один цвет. */
function pickColor(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return PLACEHOLDER_COLORS[Math.abs(hash) % PLACEHOLDER_COLORS.length]!;
}

/**
 * Аватар пользователя. Если ссылки нет или картинка не загрузилась —
 * показываем инициалы (условный рендеринг).
 */
export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  // Запоминаем, какая именно ссылка «сломалась»: если src поменяется,
  // новая картинка попробует загрузиться без дополнительного useEffect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <div className={`avatar ${showImage ? '' : 'avatar-placeholder'}`}>
      <div className={`rounded-full ${SIZE_CLASSES[size]} ${showImage ? 'bg-base-200' : pickColor(name)}`}>
        {showImage ? (
          <img src={src} alt={name} loading="lazy" onError={() => setFailedSrc(src)} />
        ) : (
          <span className="font-semibold">{getInitials(name) || '?'}</span>
        )}
      </div>
    </div>
  );
}
