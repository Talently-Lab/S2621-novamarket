import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import ProductGallery from '../components/product/ProductGallery';
import ProductPrice from '../components/product/ProductPrice';
import SpecificationsTable from '../components/product/SpecificationsTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loader from '../components/ui/Loader';
import QuantitySelector from '../components/ui/QuantitySelector';
import useProduct from '../hooks/useProduct';

const CATALOG_LINK_CLASSES =
  'focus-ring inline-flex items-center gap-2 rounded-control font-semibold text-ink underline';

function BackToCatalog() {
  return (
    <Link to="/products" className={CATALOG_LINK_CLASSES}>
      <ArrowLeft aria-hidden="true" className="h-5 w-5" />
      Volver al catálogo
    </Link>
  );
}

function ProductView({ product }) {
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;
  const onSale = product.salePrice !== null && product.salePrice !== undefined;

  // El carrito llega en el próximo PR: el botón queda visible, sin lógica todavía.
  return (
    <article className="flex flex-col gap-8">
      <BackToCatalog />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-muted">
              {[product.brand, product.category?.name]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <h1 className="text-3xl font-bold text-ink">{product.name}</h1>
            {onSale && (
              <div>
                <Badge variant="offer">Oferta</Badge>
              </div>
            )}
          </div>

          <ProductPrice
            regularPrice={product.regularPrice}
            salePrice={product.salePrice}
            size="lg"
          />

          <p
            className={outOfStock ? 'font-semibold text-error' : 'text-success'}
          >
            {outOfStock
              ? 'Sin stock'
              : `En stock: ${product.stock} ${product.stock === 1 ? 'disponible' : 'disponibles'}`}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <QuantitySelector
              value={outOfStock ? 0 : quantity}
              min={1}
              max={product.stock}
              onChange={setQuantity}
              disabled={outOfStock}
            />
            <Button disabled={outOfStock} className="sm:flex-1">
              <ShoppingCart aria-hidden="true" className="h-5 w-5" />
              Agregar al carrito
            </Button>
          </div>

          {product.description && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-ink">Descripción</h2>
              <p className="whitespace-pre-line text-ink">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <section className="flex flex-col gap-3" aria-labelledby="product-specs">
        <h2 id="product-specs" className="text-xl font-semibold text-ink">
          Especificaciones
        </h2>
        <SpecificationsTable specifications={product.specifications} />
      </section>
    </article>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const { data: product, loading, error, refetch } = useProduct(id);

  if (loading) {
    return <Loader label="Cargando producto..." />;
  }

  if (error?.code === 'PRODUCT_NOT_FOUND') {
    return (
      <EmptyState
        title="Producto no disponible"
        description="El producto que buscás no existe o ya no está a la venta."
        action={<BackToCatalog />}
      />
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col gap-6">
        <BackToCatalog />
        <ErrorMessage
          message={error?.message ?? 'No se pudo cargar el producto.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return <ProductView key={product.id} product={product} />;
}

export default ProductDetail;
