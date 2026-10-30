import { formatDate, formatPrice } from '../../utils/format';
import Badge from '../ui/Badge';

// Estados del contrato; si llega uno nuevo se muestra tal cual.
const STATUS_LABELS = {
  CREATED: 'Creado',
};

// Muestra la orden tal como la devuelve el Back: precios, subtotales y total son los calculados por la API.
function OrderDetail({ order }) {
  const { id, status, items = [], total, createdAt } = order;

  return (
    <article className="flex flex-col gap-6 rounded-card border border-border bg-white p-6 md:p-8">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-muted">Número de pedido</dt>
          <dd className="break-all font-semibold text-ink">{id}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-muted">Fecha</dt>
          <dd className="font-semibold text-ink">{formatDate(createdAt)}</dd>
        </div>
        <div className="flex flex-col items-start gap-1">
          <dt className="text-sm text-muted">Estado</dt>
          <dd>
            <Badge>{STATUS_LABELS[status] ?? status}</Badge>
          </dd>
        </div>
      </dl>

      <section aria-labelledby="order-items" className="flex flex-col gap-3">
        <h2 id="order-items" className="text-xl font-semibold text-ink">
          Productos
        </h2>
        <ul className="flex flex-col divide-y divide-border">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex flex-wrap items-baseline justify-between gap-2 py-3"
            >
              <div className="flex flex-col">
                <span className="font-medium text-ink">{item.name}</span>
                <span className="text-sm text-muted">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                </span>
              </div>
              <span className="font-semibold text-ink">
                <span className="sr-only">Subtotal: </span>
                {formatPrice(item.subtotal)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
        <span className="text-lg font-semibold text-ink">Total</span>
        <span className="text-2xl font-bold text-ink">
          {formatPrice(total)}
        </span>
      </div>
    </article>
  );
}

export default OrderDetail;
