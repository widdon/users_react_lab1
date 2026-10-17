import type { Theme } from '../../hooks/useTheme';
import { MoonIcon, RotateIcon, SunIcon, UsersIcon } from '../ui/Icons';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onResetData: () => void;
}

export function Header({ theme, onToggleTheme, onResetData }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl gap-2 px-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="grid size-10 place-items-center rounded-field bg-primary text-primary-content">
            <UsersIcon className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-bold">Users</p>
            <p className="hidden text-xs text-base-content/60 sm:block">Справочник пользователей</p>
          </div>
        </div>

        <button type="button" className="btn btn-ghost btn-sm" onClick={onResetData} title="Вернуть исходные данные">
          <RotateIcon />
          <span className="hidden sm:inline">Сбросить данные</span>
        </button>

        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
          title="Сменить тему"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  );
}
