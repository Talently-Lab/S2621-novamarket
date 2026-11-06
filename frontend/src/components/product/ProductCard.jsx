import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShoppingCart } from 'lucide-react';
import useCart from '../../hooks/useCart';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';

const FEEDBACK_DURATION_MS = 2500;

function ProductCard({ product }) {
  const { id, name, brand, category, regularPrice, salePrice, stock, images } =
    product;
  const { items, addItem } = useCart();
  const [feedback, setFeedback] = useState(null);
  const outOfStock = stock <= 0;
  const onSale = salePrice !== null && salePrice !== undefined;
  const inCart = items.find((item) => item.productId === id)?.quantity ?? 0;
  const maxedOut = !outOfStock && inCart >= stock;

  // La confirmación de "Agregado" se ve unos segundos y vuelve al estado normal.
  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timer = setTimeout(() => setFeedback(null), FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleAdd = () => {
    const added = addItem(product, 1);

    setFeedback({
      id: Date.now(),
      added: added > 0,
      message:
        added > 0
          ? `Agregaste ${name} al carrito.`
          : 'Ya tenés en el carrito todo el stock disponible.',
    });
  };

  let buttonContent = (
    <>
      <ShoppingCart aria-hidden="true" className="h-5 w-5" />
      Agregar al carrito
      <span className="sr-only">: {name}</span>
    </>
  );

  if (outOfStock) {
    buttonContent = 'Sin stock';
  } else if (feedback?.added) {
    buttonContent = (
      <>
        <Check aria-hidden="true" className="h-5 w-5" />
        Agregado
      </>
    );
  } else if (maxedOut) {
    buttonContent = 'Stock máximo en el carrito';
  }

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-white transition-shadow focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:shadow-md">
      <div className="relative">
        <ProductImage
          key={images?.[0]}
          src={images?.[0]}
          alt={name}
          className="aspect-square w-full"
        />
        {(outOfStock || onSale) && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {outOfStock && <Badge>Sin stock</Badge>}
            {onSale && <Badge variant="offer">Oferta</Badge>}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-sm text-muted">
          {[brand, category?.name].filter(Boolean).join(' · ')}
        </p>
        <h3 className="font-semibold text-ink">
          {/* El ::after extiende el enlace a toda la tarjeta; el foco se ve en el anillo del article. */}
          <Link
            to={`/products/${id}`}
            className="outline-none after:absolute after:inset-0 hover:underline"
          >
            {name}
          </Link>
        </h3>
        <div className="mt-auto flex flex-col gap-3 pt-2">
          <ProductPrice regularPrice={regularPrice} salePrice={salePrice} />
          {/* z-10 deja el botón por encima del enlace que cubre la tarjeta. */}
          <div className="relative z-10">
            <Button
              onClick={handleAdd}
              disabled={outOfStock || maxedOut}
              className="w-full px-4"
            >
              {buttonContent}
            </Button>
            <span role="status" className="sr-only">
              {feedback?.message}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
