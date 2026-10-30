import { LoaderCircle } from 'lucide-react';

const VARIANT_CLASSES = {
  primary: 'bg-ink text-white hover:bg-hover active:bg-navy',
  secondary:
    'border border-control-border bg-white text-ink hover:bg-canvas active:bg-canvas',
  danger: 'bg-error text-white',
};

function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  let stateClasses = VARIANT_CLASSES[variant];

  if (loading) {
    stateClasses = 'cursor-wait bg-primary text-white';
  } else if (disabled) {
    stateClasses = 'cursor-not-allowed bg-soft text-muted';
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={`focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-control px-6 font-semibold transition-colors ${stateClasses} ${className}`}
      {...props}
    >
      {loading && (
        <LoaderCircle
          aria-hidden="true"
          className="h-5 w-5 motion-safe:animate-spin"
        />
      )}
      {children}
    </button>
  );
}

export default Button;
