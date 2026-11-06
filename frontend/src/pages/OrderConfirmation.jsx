import { Link, useLocation, useParams } from 'react-router-dom';
import OrderDetail from '../components/order/OrderDetail';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loader from '../components/ui/Loader';
import Notice from '../components/ui/Notice';
import useOrder from '../hooks/useOrder';

const PRIMARY_LINK_CLASSES =
  'focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-control bg-ink px-6 font-semibold text-white transition-colors hover:bg-hover active:bg-navy';
const TEXT_LINK_CLASSES =
  'focus-ring rounded-control font-semibold text-ink underline';

function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const { data: order, loading, error, refetch } = useOrder(id);

  if (loading) {
    return <Loader label="Cargando tu pedido..." />;
  }

  if (error?.code === 'ORDER_NOT_FOUND') {
    return (
      <EmptyState
        title="Pedido no encontrado"
        description="El pedido que buscás no existe."
        action={
          <Link to="/products" className={PRIMARY_LINK_CLASSES}>
            Ir al catálogo
          </Link>
        }
      />
    );
  }

  // 403: la orden es de otro cliente. Reintentar no cambiaría el resultado.
  if (error?.status === 403) {
    return (
      <ErrorMessage
        message={error.message}
        action={
          <Link to="/" className={TEXT_LINK_CLASSES}>
            Volver al inicio
          </Link>
        }
      />
    );
  }

  if (error || !order) {
    return (
      <ErrorMessage
        message={error?.message ?? 'No se pudo cargar el pedido.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-ink">
          {location.state?.created ? '¡Gracias por tu compra!' : 'Tu pedido'}
        </h1>
        {location.state?.created && (
          <Notice variant="success">
            Tu pedido se creó correctamente. Estos son los precios y el total
            confirmados.
          </Notice>
        )}
      </div>

      <OrderDetail order={order} />

      <Link to="/products" className={`${PRIMARY_LINK_CLASSES} self-start`}>
        Seguir comprando
      </Link>
    </section>
  );
}

export default OrderConfirmation;
