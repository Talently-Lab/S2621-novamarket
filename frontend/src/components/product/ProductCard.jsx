import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';

function ProductCard({ product }) {
  const { id, name, brand, category, regularPrice, salePrice, stock, images } =
    product;
  const outOfStock = stock === 0;
  const onSale = salePrice !== null && salePrice !== undefined;

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
        <div className="mt-auto pt-2">
          <ProductPrice regularPrice={regularPrice} salePrice={salePrice} />
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
