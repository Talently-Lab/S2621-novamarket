import useCart from '../../hooks/useCart';
import { formatPrice } from '../../utils/format';

// Resumen del carrito con total estimado. `children` es la acción (botón o aviso) que define cada página.
function CartSummary({ title = 'Resumen', children }) {
  const { totalItems, totalAmount } = useCart();

  return (
    <aside
      aria-label={title}
      className="flex flex-col gap-4 rounded-card border border-border bg-white p-6"
    >
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <dl className="flex flex-col gap-2">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Productos</dt>
          <dd className="font-medium text-ink">{totalItems}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-2">
          <dt className="font-semibold text-ink">Total estimado</dt>
          <dd className="text-xl font-bold text-ink">
            {formatPrice(totalAmount)}
          </dd>
        </div>
      </dl>
      <p className="text-sm text-muted">
        Los precios pueden cambiar. El total final se confirma al crear el
        pedido.
      </p>
      {children}
    </aside>
  );
}

export default CartSummary;
