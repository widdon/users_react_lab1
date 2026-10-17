# Users — справочник пользователей

Лабораторная работа №1 по дисциплине «Клиентские веб-приложения». Вариант 5 — **Users**.

SPA на React для просмотра и редактирования списка пользователей. Формат данных повторяет
mock API [dummyjson.com/users](https://dummyjson.com/docs/users), поэтому в следующих работах
мок можно заменить реальными запросами без изменения компонентов.

## Стек

- React 19 + TypeScript
- Vite
- Tailwind CSS 4 + DaisyUI 5

## Возможности

- карточки пользователей (аватар, ФИО, логин, роль, пол, возраст, контакты, адрес, работа);
- сводная статистика по списку;
- поиск по имени, логину, email, городу и компании (с debounce), горячая клавиша `/`;
- фильтры по полу и роли, сортировка;
- **создание** и **редактирование** в модальной форме с валидацией
  (обязательные поля, формат email/телефона, уникальность логина и email, возраст от 14 лет);
- **удаление** с подтверждением;
- сохранение изменений в `localStorage` и сброс к исходным данным;
- светлая и тёмная тема, адаптивная вёрстка.

## Запуск

```bash
npm install
npm run dev      # режим разработки, http://localhost:5173
npm run build    # проверка типов и production-сборка в dist/
npm run preview  # просмотр собранной версии
```

Требуется Node.js 20.19+ или 22.12+.

## Структура

```
src/
├── api/usersService.ts        слой доступа к данным (сейчас — мок с задержкой)
├── data/mockUsers.ts          моковые данные в формате dummyjson
├── types/                     типы User, UserDraft, UsersResponse, UserFilters
├── constants/labels.ts        подписи для ролей, пола, сортировки
├── utils/
│   ├── date.ts                возраст, форматирование дат
│   ├── filterUsers.ts         фильтрация и сортировка (чистые функции)
│   └── userForm.ts            преобразование «форма ⇄ модель», валидация
├── hooks/
│   ├── useUsers.ts            состояние списка и CRUD-операции
│   ├── useLocalStorage.ts     useState с сохранением в localStorage
│   ├── useDebounce.ts         отложенное значение для поиска
│   ├── useTheme.ts            светлая/тёмная тема
│   └── useToast.ts            всплывающие уведомления
├── components/
│   ├── layout/Header.tsx
│   ├── users/                 UserList, UserCard, UserToolbar, UserStats,
│   │                          UserFormModal, UserListSkeleton
│   └── ui/                    Modal, ConfirmDialog, FormField, Avatar,
│                              RoleBadge, EmptyState, Toast, Icons
├── App.tsx                    корневой компонент: состояние и обработчики
└── main.tsx                   точка входа
```

## Где что применяется

| Тема | Где |
|---|---|
| Функциональные компоненты, JSX | все файлы в `components/` |
| Props и одностороннее связывание | `App` → `UserToolbar`, `UserList` → `UserCard` (данные вниз, события через колбэки вверх) |
| Рендер списков и `key` | `UserList`, опции `<select>` в `UserToolbar` и `UserFormModal` |
| Условный рендеринг | `App.renderContent` (загрузка / ошибка / пусто / не найдено / список), `Avatar`, модальные окна |
| `children`, композиция | `Modal`, `EmptyState`, `FormField` |
| `useState` и функциональные апдейтеры | `useUsers`, `UserFormModal`, `App` |
| `useEffect` с очисткой | `useUsers` (загрузка), `useDebounce`, `useLocalStorage`, `UserToolbar` (подписка на клавиатуру) |
| `useRef` | `Modal` (`showModal()`), `UserFormModal` (фокус), `UserToolbar` (фокус поиска), `useToast` (id таймера) |
| `useMemo`, `useCallback`, `memo` | фильтрация в `App`, статистика в `UserStats`, стабильные обработчики для `memo(UserCard)` |
| Кастомные хуки | `hooks/` |
