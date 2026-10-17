import type { Gender, User, UserDraft, UserRole } from '../types/user';
import { calcAge } from './date';

/**
 * Значения формы. Все поля — строки, потому что <input> работает со строками.
 * Вложенные объекты API (address, company) в форме «расплющены».
 */
export interface UserFormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  role: UserRole;
  image: string;
  city: string;
  country: string;
  companyName: string;
  department: string;
  title: string;
}

export type UserFormErrors = Partial<Record<keyof UserFormValues, string>>;

export const EMPTY_FORM: UserFormValues = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: 'female',
  role: 'user',
  image: '',
  city: '',
  country: '',
  companyName: '',
  department: '',
  title: '',
};

export function userToFormValues(user: User): UserFormValues {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    birthDate: user.birthDate,
    gender: user.gender,
    role: user.role,
    image: user.image,
    city: user.address.city,
    country: user.address.country,
    companyName: user.company.name,
    department: user.company.department,
    title: user.company.title,
  };
}

/** Собирает из плоской формы объект в формате API. */
export function formValuesToDraft(values: UserFormValues, previous?: User): UserDraft {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    username: values.username.trim().toLowerCase(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    birthDate: values.birthDate,
    age: calcAge(values.birthDate),
    gender: values.gender,
    role: values.role,
    image: values.image.trim(),
    address: {
      address: previous?.address.address ?? '',
      city: values.city.trim(),
      country: values.country.trim(),
    },
    company: {
      name: values.companyName.trim(),
      department: values.department.trim(),
      title: values.title.trim(),
    },
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-z0-9._]{3,20}$/i;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const URL_RE = /^https?:\/\/\S+$/i;

interface ValidationContext {
  /** Все пользователи — для проверки уникальности логина и email. */
  users: User[];
  /** id редактируемого пользователя (его самого при проверке уникальности не учитываем). */
  editingId?: number;
}

export function validateUserForm(values: UserFormValues, ctx: ValidationContext): UserFormErrors {
  const errors: UserFormErrors = {};
  const others = ctx.users.filter((u) => u.id !== ctx.editingId);

  const firstName = values.firstName.trim();
  if (!firstName) errors.firstName = 'Укажите имя';
  else if (firstName.length < 2) errors.firstName = 'Минимум 2 символа';

  const lastName = values.lastName.trim();
  if (!lastName) errors.lastName = 'Укажите фамилию';
  else if (lastName.length < 2) errors.lastName = 'Минимум 2 символа';

  const username = values.username.trim().toLowerCase();
  if (!username) errors.username = 'Укажите логин';
  else if (!USERNAME_RE.test(username)) errors.username = '3–20 символов: латиница, цифры, точка, _';
  else if (others.some((u) => u.username.toLowerCase() === username)) errors.username = 'Такой логин уже занят';

  const email = values.email.trim().toLowerCase();
  if (!email) errors.email = 'Укажите email';
  else if (!EMAIL_RE.test(email)) errors.email = 'Некорректный email';
  else if (others.some((u) => u.email.toLowerCase() === email)) errors.email = 'Этот email уже используется';

  if (!values.phone.trim()) errors.phone = 'Укажите телефон';
  else if (!PHONE_RE.test(values.phone.trim())) errors.phone = 'Например: +7 900 123-45-67';

  if (!values.birthDate) {
    errors.birthDate = 'Укажите дату рождения';
  } else {
    const age = calcAge(values.birthDate);
    if (new Date(values.birthDate) > new Date()) errors.birthDate = 'Дата не может быть в будущем';
    else if (age < 14) errors.birthDate = 'Пользователю должно быть не меньше 14 лет';
    else if (age > 120) errors.birthDate = 'Проверьте год рождения';
  }

  if (values.image.trim() && !URL_RE.test(values.image.trim())) {
    errors.image = 'Ссылка должна начинаться с http:// или https://';
  }

  return errors;
}

export function hasErrors(errors: UserFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
