// Estados del contrato; si llega uno nuevo se muestra tal cual.
const ORDER_STATUS_LABELS = {
  CREATED: 'Creado',
};

export function getOrderStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] ?? status;
}

// Id corto para listados: los últimos 8 caracteres, en mayúsculas.
export function getShortOrderId(id) {
  return `#${String(id ?? '')
    .slice(-8)
    .toUpperCase()}`;
}

// Cantidad de unidades de la orden (suma de `quantity`).
export function countOrderUnits(order) {
  return (order.items ?? []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
}

export function sortOrdersByDateDesc(orders) {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function fullName(person) {
  return [person?.name, person?.lastName].filter(Boolean).join(' ');
}

// El contrato todavía no incluye datos del comprador. Si el Back los agrega (`user`, `customer` o `buyer`,
// o campos sueltos), se muestran; si no, devuelve null y las vistas omiten la columna.
export function getOrderBuyer(order) {
  const person = order.user ?? order.customer ?? order.buyer;
  const source =
    person && typeof person === 'object'
      ? person
      : {
          name: order.userName ?? order.customerName,
          email: order.userEmail ?? order.customerEmail,
        };
  const name = fullName(source);
  const email = typeof source.email === 'string' ? source.email : '';

  if (!name && !email) {
    return null;
  }

  return { name, email };
}
