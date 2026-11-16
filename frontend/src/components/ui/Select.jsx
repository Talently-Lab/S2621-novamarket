import { useId } from 'react';
import FieldMessages from './FieldMessages';

function Select({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  hint,
  children,
  ...props
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`focus-ring h-12 w-full rounded-control border bg-white px-4 text-ink disabled:cursor-not-allowed disabled:bg-soft disabled:text-muted ${error ? 'border-error' : 'border-control-border'}`}
        {...props}
      >
        {children}
      </select>
      <FieldMessages
        hint={hint}
        hintId={hintId}
        error={error}
        errorId={errorId}
      />
    </div>
  );
}

export default Select;
