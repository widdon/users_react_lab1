/**
 * dummyjson отдаёт даты без ведущих нулей ("1996-5-30"),
 * а <input type="date"> ожидает строго YYYY-MM-DD. Приводим к единому виду.
 */
export function normalizeDate(value: string): string {
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/** Возраст в полных годах на сегодняшний день. */
export function calcAge(birthDate: string, today: Date = new Date()): number {
  const birth = new Date(normalizeDate(birthDate));
  if (Number.isNaN(birth.getTime())) return 0;

  let age = today.getFullYear() - birth.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hadBirthdayThisYear) age -= 1;
  return age;
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatDate(value: string): string {
  const date = new Date(normalizeDate(value));
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

/** Склонение слова «год» для возраста: 21 год, 23 года, 30 лет. */
export function pluralizeYears(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} год`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} года`;
  return `${n} лет`;
}
