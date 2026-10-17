import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { GENDERS, GENDER_LABELS, ROLES, ROLE_LABELS } from '../../constants/labels';
import type { User, UserDraft } from '../../types/user';
import { calcAge, pluralizeYears } from '../../utils/date';
import {
  EMPTY_FORM,
  formValuesToDraft,
  hasErrors,
  userToFormValues,
  validateUserForm,
  type UserFormErrors,
  type UserFormValues,
} from '../../utils/userForm';
import { Avatar } from '../ui/Avatar';
import { FormField } from '../ui/FormField';
import { Modal } from '../ui/Modal';

interface UserFormModalProps {
  /** null — создание нового пользователя, User — редактирование существующего. */
  user: User | null;
  /** Все пользователи — нужны для проверки уникальности логина и email. */
  users: User[];
  onSubmit: (draft: UserDraft) => void;
  onClose: () => void;
}

/**
 * Форма создания/редактирования пользователя.
 *
 * Все поля — управляемые (controlled): значение каждого <input> берётся из
 * состояния values, а onChange обновляет это состояние. Так React —
 * единственный источник правды о содержимом формы.
 */
export function UserFormModal({ user, users, onSubmit, onClose }: UserFormModalProps) {
  const isEdit = user !== null;
  const formId = useId();

  // Ленивая инициализация: функция выполнится только при первом рендере
  const [values, setValues] = useState<UserFormValues>(() => (user ? userToFormValues(user) : EMPTY_FORM));
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // При открытии ставим фокус в первое поле
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const validate = (next: UserFormValues) => validateUserForm(next, { users, editingId: user?.id });

  // Один обработчик на все поля: имя поля берём из атрибута name
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const next = { ...values, [name]: value } as UserFormValues;
    setValues(next);
    // После первой попытки отправки подсвечиваем ошибки «на лету»
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      // Переводим фокус на первое поле с ошибкой
      const firstInvalid = Object.keys(nextErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    onSubmit(formValuesToDraft(values, user ?? undefined));
  };

  /** Общие props для текстовых полей, чтобы не повторять их в каждом <input>. */
  const fieldProps = (name: keyof UserFormValues) => ({
    id: `${formId}-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    'aria-invalid': Boolean(errors[name]),
  });

  const inputClass = (name: keyof UserFormValues) => `input w-full ${errors[name] ? 'input-error' : ''}`;

  const previewName = `${values.firstName} ${values.lastName}`.trim() || 'Новый пользователь';
  const previewAge = values.birthDate ? calcAge(values.birthDate) : null;

  return (
    <Modal title={isEdit ? 'Редактирование пользователя' : 'Новый пользователь'} onClose={onClose} size="lg">
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        {/* Живой предпросмотр: перерисовывается вместе с изменением values */}
        <div className="mb-4 flex items-center gap-4 rounded-box bg-base-200 p-4">
          <Avatar src={values.image} name={previewName} size="xl" />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{previewName}</p>
            <p className="truncate text-sm text-base-content/60">
              {values.username ? `@${values.username}` : 'логин не указан'}
              {previewAge !== null && previewAge >= 0 && ` · ${pluralizeYears(previewAge)}`}
            </p>
          </div>
        </div>

        <h4 className="mt-2 text-sm font-semibold tracking-wide text-base-content/50 uppercase">Основное</h4>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <FormField label="Имя" htmlFor={`${formId}-firstName`} required error={errors.firstName}>
            <input ref={firstInputRef} className={inputClass('firstName')} placeholder="Emily" {...fieldProps('firstName')} />
          </FormField>
          <FormField label="Фамилия" htmlFor={`${formId}-lastName`} required error={errors.lastName}>
            <input className={inputClass('lastName')} placeholder="Johnson" {...fieldProps('lastName')} />
          </FormField>
          <FormField label="Логин" htmlFor={`${formId}-username`} required error={errors.username}>
            <input className={inputClass('username')} placeholder="emilys" autoComplete="off" {...fieldProps('username')} />
          </FormField>
          <FormField label="Дата рождения" htmlFor={`${formId}-birthDate`} required error={errors.birthDate}>
            <input type="date" className={inputClass('birthDate')} {...fieldProps('birthDate')} />
          </FormField>
          <FormField label="Пол" htmlFor={`${formId}-gender`}>
            <select className="select w-full" {...fieldProps('gender')}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {GENDER_LABELS[g]}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Роль" htmlFor={`${formId}-role`}>
            <select className="select w-full" {...fieldProps('role')}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <h4 className="mt-4 text-sm font-semibold tracking-wide text-base-content/50 uppercase">Контакты</h4>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <FormField label="Email" htmlFor={`${formId}-email`} required error={errors.email}>
            <input type="email" className={inputClass('email')} placeholder="name@example.com" {...fieldProps('email')} />
          </FormField>
          <FormField label="Телефон" htmlFor={`${formId}-phone`} required error={errors.phone}>
            <input type="tel" className={inputClass('phone')} placeholder="+7 900 123-45-67" {...fieldProps('phone')} />
          </FormField>
          <FormField
            label="Ссылка на аватар"
            htmlFor={`${formId}-image`}
            error={errors.image}
            hint="Необязательно. Без ссылки будут показаны инициалы"
            className="sm:col-span-2"
          >
            <input type="url" className={inputClass('image')} placeholder="https://…" {...fieldProps('image')} />
          </FormField>
        </div>

        <h4 className="mt-4 text-sm font-semibold tracking-wide text-base-content/50 uppercase">Адрес и работа</h4>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <FormField label="Город" htmlFor={`${formId}-city`}>
            <input className="input w-full" placeholder="Phoenix" {...fieldProps('city')} />
          </FormField>
          <FormField label="Страна" htmlFor={`${formId}-country`}>
            <input className="input w-full" placeholder="United States" {...fieldProps('country')} />
          </FormField>
          <FormField label="Компания" htmlFor={`${formId}-companyName`}>
            <input className="input w-full" placeholder="Dooley, Kozey and Cronin" {...fieldProps('companyName')} />
          </FormField>
          <FormField label="Отдел" htmlFor={`${formId}-department`}>
            <input className="input w-full" placeholder="Engineering" {...fieldProps('department')} />
          </FormField>
          <FormField label="Должность" htmlFor={`${formId}-title`} className="sm:col-span-2">
            <input className="input w-full" placeholder="Sales Manager" {...fieldProps('title')} />
          </FormField>
        </div>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Сохранить изменения' : 'Создать пользователя'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
