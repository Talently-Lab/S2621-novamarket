import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import useCart from '../../hooks/useCart';
import { formatPrice } from '../../utils/format';
import ProductImage from '../product/ProductImage';
import QuantitySelector from '../ui/QuantitySelector';

function CartItem({ item, readOnly = false }) {
  const { updateQuantity, removeItem } = useCart();
  const { productId, name, image, price, stock, quantity } = item;

  if (readOnly) {
    return (
      <article className="flex items-center gap-4">
        <ProductImage
          key={image}
          src={image}
          alt=""
          className="h-16 w-16 shrink-0 rounded-control border border-border"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="font-semibold text-ink">{name}</h3>
          <p className="text-sm text-muted">
            {quantity} × {formatPrice(price)}
          </p>
        </div>
        <p className="font-semibold text-ink">
          {formatPrice(price * quantity)}
        </p>
      </article>
    );
  }

  return (
    <article className="grid grid-cols-[5rem_1fr] gap-4 rounded-card border border-border bg-white p-4 md:grid-cols-[7rem_1fr]">
      <ProductImage
        key={image}
        src={image}
        alt=""
        className="aspect-square w-full rounded-control border border-border"
      />
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-ink">
            <Link
              to={`/products/${productId}`}
              className="focus-ring rounded-control hover:underline"
            >
              {name}
            </Link>
          </h3>
          <p className="text-muted">
            {formatPrice(price)} <span className="text-sm">por unidad</span>
          </p>
          <p className="text-sm text-muted">
            {stock} {stock === 1 ? 'disponible' : 'disponibles'}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-4 md:flex-col md:items-end">
          <QuantitySelector
            value={quantity}
            min={1}
            max={stock}
            onChange={(value) => updateQuantity(productId, value)}
          />
          <p className="inline-flex h-12 items-center font-bold text-ink">
            <span className="sr-only">Subtotal: </span>
            {formatPrice(price * quantity)}
          </p>
          <button
            type="button"
            onClick={() => removeItem(productId)}
            className="focus-ring inline-flex h-12 items-center gap-2 rounded-control px-2 font-medium text-error hover:underline"
          >
            <Trash2 aria-hidden="true" className="h-5 w-5" />
            Quitar
            <span className="sr-only"> {name} del carrito</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
