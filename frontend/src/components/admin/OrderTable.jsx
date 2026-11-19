import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { formatPrice, formatShortDate } from '../../utils/format';
import {
  countOrderUnits,
  getOrderBuyer,
  getOrderStatusLabel,
  getShortOrderId,
} from '../../utils/order';

const DETAIL_LINK_CLASSES =
  'focus-ring inline-flex h-12 items-center justify-center whitespace-nowrap rounded-control border border-control-border bg-white px-4 font-semibold text-ink transition-colors hover:bg-canvas';

function unitsLabel(order) {
  const units = countOrderUnits(order);
  return `${units} ${units === 1 ? 'unidad' : 'unidades'}`;
}

function BuyerCell({ buyer }) {
  if (!buyer) return <span className="text-muted">Sin datos</span>;

  return (
    <span className="flex flex-col">
      {buyer.name && <span className="text-ink">{buyer.name}</span>}
      {buyer.email && (
        <span className="break-all text-sm text-muted">{buyer.email}</span>
      )}
    </span>
  );
}

function DetailLink({ order }) {
  return (
    <Link to={`/admin/orders/${order.id}`} className={DETAIL_LINK_CLASSES}>
      Ver detalle
      <span className="sr-only"> del pedido {getShortOrderId(order.id)}</span>
    </Link>
  );
}

// La columna Cliente solo aparece si la API manda datos del comprador en alguna orden.
function OrderTable({ orders }) {
  const showBuyer = orders.some((order) => getOrderBuyer(order));

  return (
    <>
      <div className="hidden overflow-x-auto rounded-card border border-border bg-white md:block">
        <table className="w-full text-left">
          <caption className="sr-only">Pedidos</caption>
          <thead className="border-b border-border bg-canvas text-sm text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Pedido
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Fecha
              </th>
              {showBuyer && (
                <th scope="col" className="px-4 py-3 font-semibold">
                  Cliente
                </th>
              )}
              <th scope="col" className="px-4 py-3 font-semibold">
                Productos
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Total
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Estado
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id}>
                <th
                  scope="row"
                  className="px-4 py-3 font-mono font-semibold text-ink"
                >
                  {getShortOrderId(order.id)}
                </th>
                <td className="px-4 py-3 text-ink">
                  {formatShortDate(order.createdAt)}
                </td>
                {showBuyer && (
                  <td className="px-4 py-3">
                    <BuyerCell buyer={getOrderBuyer(order)} />
                  </td>
                )}
                <td className="px-4 py-3 text-ink">{unitsLabel(order)}</td>
                <td className="px-4 py-3 font-semibold text-ink">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  <Badge>{getOrderStatusLabel(order.status)}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <DetailLink order={order} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-4 md:hidden">
        {orders.map((order) => {
          const buyer = getOrderBuyer(order);

          return (
            <li
              key={order.id}
              className="flex flex-col gap-3 rounded-card border border-border bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-mono font-semibold text-ink">
                  <span className="sr-only">Pedido </span>
                  {getShortOrderId(order.id)}
                </h3>
                <Badge>{getOrderStatusLabel(order.status)}</Badge>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col gap-1">
                  <dt className="text-muted">Fecha</dt>
                  <dd className="text-ink">
                    {formatShortDate(order.createdAt)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-muted">Productos</dt>
                  <dd className="text-ink">{unitsLabel(order)}</dd>
                </div>
                {buyer && (
                  <div className="col-span-2 flex flex-col gap-1">
                    <dt className="text-muted">Cliente</dt>
                    <dd>
                      <BuyerCell buyer={buyer} />
                    </dd>
                  </div>
                )}
                <div className="col-span-2 flex flex-col gap-1">
                  <dt className="text-muted">Total</dt>
                  <dd className="text-lg font-bold text-ink">
                    {formatPrice(order.total)}
                  </dd>
                </div>
              </dl>
              <DetailLink order={order} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default OrderTable;
