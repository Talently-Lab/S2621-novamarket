import { useCallback, useMemo } from 'react';
import OrderTable from '../../components/admin/OrderTable';
import EmptyState from '../../components/ui/EmptyState';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Loader from '../../components/ui/Loader';
import useRequest from '../../hooks/useRequest';
import orderService from '../../services/orderService';
import { sortOrdersByDateDesc } from '../../utils/order';

function AdminOrders() {
  const request = useCallback(
    (signal) => orderService.getOrders({ signal }),
    [],
  );
  const { data, loading, error, refetch } = useRequest(request);
  // GET /api/orders no pagina: se ordena por fecha, de la más nueva a la más vieja.
  const orders = useMemo(
    () => (data ? sortOrdersByDateDesc(data.orders ?? []) : null),
    [data],
  );

  let content;

  if (loading) {
    content = <Loader label="Cargando pedidos..." />;
  } else if (error) {
    content = <ErrorMessage message={error.message} onRetry={refetch} />;
  } else if (orders.length === 0) {
    content = (
      <EmptyState
        title="Todavía no hay pedidos"
        description="Cuando los clientes compren, sus pedidos van a aparecer acá."
      />
    );
  } else {
    content = <OrderTable orders={orders} />;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-ink">Pedidos</h1>
        <p role="status" className="text-muted">
          {orders &&
            `${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'}`}
        </p>
      </div>
      {content}
    </section>
  );
}

export default AdminOrders;
