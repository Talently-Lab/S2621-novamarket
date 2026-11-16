import { CircleAlert } from 'lucide-react';

// Ayuda y error debajo de un campo, con los ids que el control referencia en aria-describedby.
function FieldMessages({ hint, hintId, error, errorId }) {
  return (
    <>
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
    </>
  );
}

export default FieldMessages;
