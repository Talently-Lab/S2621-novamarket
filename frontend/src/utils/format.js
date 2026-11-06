const PRICE_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const DATE_FORMAT = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'long',
  timeStyle: 'short',
});

export function formatPrice(value) {
  return PRICE_FORMAT.format(value);
}

// Devuelve el valor tal cual si no es una fecha válida, para no mostrar "Invalid Date".
export function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value ?? '')
    : DATE_FORMAT.format(date);
}
