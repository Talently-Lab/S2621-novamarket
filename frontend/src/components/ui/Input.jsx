import { useId } from 'react';
import { CircleAlert } from 'lucide-react';

function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  hint,
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
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`focus-ring h-12 w-full rounded-control border bg-white px-4 text-ink placeholder:text-muted ${error ? 'border-error' : 'border-control-border'}`}
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-start gap-2 text-sm text-error">
          <CircleAlert aria-hidden="true" className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default Input;
