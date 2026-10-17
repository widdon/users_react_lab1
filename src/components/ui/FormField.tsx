import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  /** Сам элемент ввода (<input>, <select>) передаётся через children. */
  children: ReactNode;
}

/** Подпись + поле + сообщение об ошибке или подсказка. */
export function FormField({ label, htmlFor, required, error, hint, className = '', children }: FormFieldProps) {
  return (
    <div className={`fieldset py-0 ${className}`}>
      <label htmlFor={htmlFor} className="fieldset-legend pb-1">
        {label}
        {required && <span className="text-error">*</span>}
      </label>
      {children}
      {error ? (
        <p className="label text-error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="label">{hint}</p>
      )}
    </div>
  );
}
