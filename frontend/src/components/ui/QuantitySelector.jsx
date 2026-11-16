import { useId } from 'react';
import { Minus, Plus } from 'lucide-react';

const STEP_CLASSES =
  'focus-ring inline-flex h-12 w-12 items-center justify-center rounded-control border border-control-border bg-white text-ink hover:bg-canvas disabled:cursor-not-allowed disabled:bg-soft disabled:text-muted';

function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  disabled = false,
  label = 'Cantidad',
}) {
  const labelId = useId();

  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className="text-sm font-medium text-ink">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className="flex items-center gap-2"
      >
        <button
          type="button"
          aria-label="Restar uno"
          disabled={disabled || value <= min}
          onClick={() => onChange(value - 1)}
          className={STEP_CLASSES}
        >
          <Minus aria-hidden="true" className="h-5 w-5" />
        </button>
        <output
          aria-live="polite"
          className="inline-flex h-12 min-w-12 items-center justify-center px-2 text-lg font-semibold"
        >
          {value}
        </output>
        <button
          type="button"
          aria-label="Sumar uno"
          disabled={disabled || value >= max}
          onClick={() => onChange(value + 1)}
          className={STEP_CLASSES}
        >
          <Plus aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default QuantitySelector;
