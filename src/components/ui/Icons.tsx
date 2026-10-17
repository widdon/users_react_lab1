import type { SVGProps } from 'react';

/**
 * Набор простых SVG-иконок (контуры в стиле Lucide).
 * Все иконки — обычные функциональные компоненты, принимающие стандартные props <svg>.
 */
type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, className = 'size-4', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export const UsersIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </BaseIcon>
);

export const PlusIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M12 5v14M5 12h14" />
  </BaseIcon>
);

export const SearchIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </BaseIcon>
);

export const PencilIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </BaseIcon>
);

export const TrashIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </BaseIcon>
);

export const MailIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </BaseIcon>
);

export const PhoneIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </BaseIcon>
);

export const MapPinIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </BaseIcon>
);

export const BriefcaseIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </BaseIcon>
);

export const CakeIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01" />
  </BaseIcon>
);

export const SunIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </BaseIcon>
);

export const MoonIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </BaseIcon>
);

export const RotateIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </BaseIcon>
);

export const XIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </BaseIcon>
);

export const FilterXIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M13 13v8l-4-2v-6L3 4h18l-3.5 4.5" />
    <path d="m22 9-5 5M17 9l5 5" />
  </BaseIcon>
);
