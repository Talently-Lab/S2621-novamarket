import { CircleAlert } from 'lucide-react';
import Button from './Button';

function ErrorMessage({ message, onRetry, action }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-control border border-error bg-white p-4 text-error"
    >
      <p className="flex items-start gap-2">
        <CircleAlert aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span>{message}</span>
      </p>
      {(onRetry || action) && (
        <div className="flex flex-wrap gap-3">
          {onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              Reintentar
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}

export default ErrorMessage;
