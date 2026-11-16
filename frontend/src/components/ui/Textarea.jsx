import { useId } from 'react';
import FieldMessages from './FieldMessages';

function Textarea({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  hint,
  rows = 4,
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
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`focus-ring w-full rounded-control border bg-white px-4 py-3 text-ink placeholder:text-muted ${error ? 'border-error' : 'border-control-border'}`}
        {...props}
      />
      <FieldMessages
        hint={hint}
        hintId={hintId}
        error={error}
        errorId={errorId}
      />
    </div>
  );
}

export default Textarea;
