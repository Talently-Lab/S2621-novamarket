import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CircleCheck,
  CircleOff,
  DollarSign,
  Package,
  ReceiptText,
  TriangleAlert,
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Loader from '../../components/ui/Loader';
import useRequest from '../../hooks/useRequest';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import { formatPrice, formatShortDate } from '../../utils/format';
import { getShortOrderId, sortOrdersByDateDesc } from '../../utils/order';

const LOW_STOCK_THRESHOLD = 5;
const LIST_SIZE = 5;

const TEXT_LINK_CLASSES =
  'focus-ring rounded-control font-semibold text-ink underline';
const PANEL_CLASSES =
  'flex flex-col gap-4 rounded-card border border-border bg-white p-5 md:p-6';

// Métricas calculadas en Front: no hay endpoint de estadísticas.
function getProductStats(products) {
  const active = products.filter((product) => product.active);
  const lowStock = active
    .filter((product) => product.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock);

  return {
    total: products.length,
    active: active.length,
    inactive: products.length - active.length,
    lowStock,
  };
}

function getOrderStats(orders) {
  return {
    count: orders.length,
    totalSold: orders.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0,
    ),
    latest: sortOrdersByDateDesc(orders).slice(0, LIST_SIZE),
  };
}

function AdminDashboard() {
  const productsRequest = useCallback(
    (signal) => productService.getAllProducts({ active: 'all' }, { signal }),
    [],
  );
  const ordersRequest = useCallback(
    (signal) => orderService.getOrders({ signal }),
    [],
  );
  const products = useRequest(productsRequest);
  const orders = useRequest(ordersRequest);

  const productStats = useMemo(
    () => (products.data ? getProductStats(products.data) : null),
    [products.data],
  );
  const orderStats = useMemo(
    () => (orders.data ? getOrderStats(orders.data.orders ?? []) : null),
    [orders.data],
  );

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-ink">Resumen</h1>

      <section aria-labelledby="stats-products" className="flex flex-col gap-3">
        <h2 id="stats-products" className="text-xl font-semibold text-ink">
          Catálogo
        </h2>
        {products.loading && <Loader label="Cargando productos..." />}
        {products.error && (
          <ErrorMessage
            message="No se pudieron cargar las métricas de productos."
            onRetry={products.refetch}
          />
        )}
        {productStats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Productos"
              value={productStats.total}
              Icon={Package}
            />
            <StatCard
              label="Activos"
              value={productStats.active}
              Icon={CircleCheck}
            />
            <StatCard
              label="Inactivos"
              value={productStats.inactive}
              Icon={CircleOff}
            />
            <StatCard
              label="Stock bajo"
              value={productStats.lowStock.length}
              hint={`Activos con ${LOW_STOCK_THRESHOLD} unidades o menos`}
              Icon={TriangleAlert}
              tone={productStats.lowStock.length > 0 ? 'warning' : 'default'}
            />
          </div>
        )}
      </section>

      <section aria-labelledby="stats-orders" className="flex flex-col gap-3">
        <h2 id="stats-orders" className="text-xl font-semibold text-ink">
          Ventas
        </h2>
        {orders.loading && <Loader label="Cargando pedidos..." />}
        {orders.error && (
          <ErrorMessage
            message="No se pudieron cargar las métricas de pedidos."
            onRetry={orders.refetch}
          />
        )}
        {orderStats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Pedidos"
              value={orderStats.count}
              Icon={ReceiptText}
            />
            <StatCard
              label="Total vendido"
              value={formatPrice(orderStats.totalSold)}
              hint="Suma de los totales de todos los pedidos"
              Icon={DollarSign}
            />
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-labelledby="low-stock" className={PANEL_CLASSES}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="low-stock" className="text-xl font-semibold text-ink">
              Productos con stock bajo
            </h2>
            <Link to="/admin/products" className={TEXT_LINK_CLASSES}>
              Ver productos
            </Link>
          </div>
          {products.loading && <Loader size="sm" />}
          {products.error && (
            <p className="text-muted">No se pudo cargar la lista.</p>
          )}
          {productStats && productStats.lowStock.length === 0 && (
            <p className="text-muted">
              Ningún producto activo tiene stock bajo.
            </p>
          )}
          {productStats && productStats.lowStock.length > 0 && (
            <ul className="flex flex-col divide-y divide-border">
              {productStats.lowStock.slice(0, LIST_SIZE).map((product) => (
                <li
                  key={product.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="break-words font-medium text-ink">
                      {product.name}
                    </span>
                    <span
                      className={`text-sm ${product.stock === 0 ? 'font-semibold text-error' : 'text-muted'}`}
                    >
                      {product.stock === 0
                        ? 'Sin stock'
                        : `${product.stock} ${product.stock === 1 ? 'unidad' : 'unidades'}`}
                    </span>
                  </div>
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    state={{ product }}
                    className={TEXT_LINK_CLASSES}
                  >
                    Editar
                    <span className="sr-only"> {product.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="latest-orders" className={PANEL_CLASSES}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="latest-orders" className="text-xl font-semibold text-ink">
              Últimos pedidos
            </h2>
            <Link to="/admin/orders" className={TEXT_LINK_CLASSES}>
              Ver pedidos
            </Link>
          </div>
          {orders.loading && <Loader size="sm" />}
          {orders.error && (
            <p className="text-muted">No se pudo cargar la lista.</p>
          )}
          {orderStats && orderStats.latest.length === 0 && (
            <p className="text-muted">Todavía no hay pedidos.</p>
          )}
          {orderStats && orderStats.latest.length > 0 && (
            <ul className="flex flex-col divide-y divide-border">
              {orderStats.latest.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <div className="flex flex-col">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className={TEXT_LINK_CLASSES}
                    >
                      <span className="sr-only">Pedido </span>
                      {getShortOrderId(order.id)}
                    </Link>
                    <span className="text-sm text-muted">
                      {formatShortDate(order.createdAt)}
                    </span>
                  </div>
                  <span className="font-semibold text-ink">
                    {formatPrice(order.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}

export default AdminDashboard;
