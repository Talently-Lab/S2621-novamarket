function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  if (Array.isArray(value)) {
    return value.map(formatValue).join(', ');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, nested]) => `${key}: ${formatValue(nested)}`)
      .join(', ');
  }

  return String(value);
}

// `specifications` es un objeto flexible: se listan sus pares clave-valor tal como vienen.
function SpecificationsTable({ specifications }) {
  const entries = Object.entries(specifications ?? {});

  if (entries.length === 0) {
    return (
      <p className="text-muted">Este producto no tiene especificaciones.</p>
    );
  }

  return (
    <dl className="divide-y divide-border overflow-hidden rounded-card border border-border bg-white">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4"
        >
          <dt className="font-medium text-ink first-letter:uppercase">{key}</dt>
          <dd className="text-muted sm:col-span-2">{formatValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default SpecificationsTable;
