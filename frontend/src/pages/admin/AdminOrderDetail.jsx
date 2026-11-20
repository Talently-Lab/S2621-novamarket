import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import OrderDetail from '../../components/order/OrderDetail';
import EmptyState from '../../components/ui/EmptyState';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Loader from '../../components/ui/Loader';
import useOrder from '../../hooks/useOrder';
import { getOrderBuyer, getShortOrderId } from '../../utils/order';

const BACK_LINK_CLASSES =
  'focus-ring inline-flex items-center gap-1 self-start rounded-control font-semibold text-ink underline';
const PRIMARY_LINK_CLASSES =
  'focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-control bg-ink px-6 font-semibold text-white transition-colors hover:bg-hover active:bg-navy';

function AdminOrderDetail() {
  const { id } = useParams();
  const { data: order, loading, error, refetch } = useOrder(id);
  const buyer = order ? getOrderBuyer(order) : null;

  let content;

  if (loading) {
    content = <Loader label="Cargando pedido..." />;
  } else if (error?.code === 'ORDER_NOT_FOUND') {
    content = (
      <EmptyState
        title="Pedido no encontrado"
        description="El pedido que buscás no existe."
        action={
          <Link to="/admin/orders" className={PRIMARY_LINK_CLASSES}>
            Ir a pedidos
          </Link>
        }
      />
    );
  } else if (error || !order) {
    content = (
      <ErrorMessage
        message={error?.message ?? 'No se pudo cargar el pedido.'}
        onRetry={refetch}
      />
    );
  } else {
    content = (
      <>
        {buyer && (
          <section
            aria-labelledby="order-buyer"
            className="flex flex-col gap-1 rounded-card border border-border bg-white p-6"
          >
            <h2 id="order-buyer" className="text-sm text-muted">
              Cliente
            </h2>
            {buyer.name && (
              <p className="font-semibold text-ink">{buyer.name}</p>
            )}
            {buyer.email && <p className="break-all text-ink">{buyer.email}</p>}
          </section>
        )}
        <OrderDetail order={order} />
      </>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <Link to="/admin/orders" className={BACK_LINK_CLASSES}>
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        Volver a pedidos
      </Link>
      <h1 className="text-3xl font-bold text-ink">
        {order ? `Pedido ${getShortOrderId(order.id)}` : 'Detalle del pedido'}
      </h1>
      {content}
    </section>
  );
}

export default AdminOrderDetail;
