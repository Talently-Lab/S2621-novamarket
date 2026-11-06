import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/ui/EmptyState';
import useCart from '../hooks/useCart';

const PRIMARY_LINK_CLASSES =
  'focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-control bg-ink px-6 font-semibold text-white transition-colors hover:bg-hover active:bg-navy';
const TEXT_LINK_CLASSES =
  'focus-ring self-center rounded-control font-semibold text-ink underline';

function Cart() {
  const { items, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <section className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-ink">Carrito</h1>
        <EmptyState
          title="Tu carrito está vacío"
          description="Explorá el catálogo y agregá los productos que quieras comprar."
          action={
            <Link to="/products" className={PRIMARY_LINK_CLASSES}>
              Ir al catálogo
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-ink">Carrito</h1>
        <p className="text-muted">
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu
          carrito
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.productId}>
              <CartItem item={item} />
            </li>
          ))}
        </ul>

        <CartSummary>
          <Link to="/checkout" className={PRIMARY_LINK_CLASSES}>
            Ir al checkout
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
          <Link to="/products" className={TEXT_LINK_CLASSES}>
            Seguir comprando
          </Link>
        </CartSummary>
      </div>
    </section>
  );
}

export default Cart;
