import { useId } from 'react';

const OPTION_CLASSES =
  'focus-ring inline-flex h-12 items-center rounded-full border px-5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

// Filtra por el `id` de la categoría y muestra el `name` (FE-03). Con error, el catálogo sigue usable.
function CategoryFilter({
  categories,
  value,
  onChange,
  loading,
  error,
  onRetry,
}) {
  const labelId = useId();
  const options = [{ id: '', name: 'Todos' }, ...(categories ?? [])];

  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className="text-sm font-medium text-ink">
        Categoría
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className="flex flex-wrap gap-2"
      >
        {options.map((category) => {
          const selected = value === category.id;

          return (
            <button
              key={category.id || 'all'}
              type="button"
              aria-pressed={selected}
              disabled={loading}
              onClick={() => onChange(category.id)}
              className={`${OPTION_CLASSES} ${selected ? 'border-ink bg-ink text-white' : 'border-control-border bg-white text-ink hover:bg-canvas'}`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
      {loading && (
        <p role="status" className="text-sm text-muted">
          Cargando categorías...
        </p>
      )}
      {error && (
        <p role="status" className="text-sm text-muted">
          No se pudieron cargar las categorías. Podés seguir viendo el catálogo.{' '}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="focus-ring rounded-control font-semibold text-ink underline"
            >
              Reintentar
            </button>
          )}
        </p>
      )}
    </div>
  );
}

export default CategoryFilter;
