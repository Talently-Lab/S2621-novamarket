import EmptyState from '../ui/EmptyState';
import ErrorMessage from '../ui/ErrorMessage';
import ProductCard from './ProductCard';

const GRID_CLASSES =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4';

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-border bg-white">
      <div className="aspect-square w-full bg-soft motion-safe:animate-pulse" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-1/2 rounded bg-soft motion-safe:animate-pulse" />
        <div className="h-5 w-3/4 rounded bg-soft motion-safe:animate-pulse" />
        <div className="h-6 w-1/3 rounded bg-soft motion-safe:animate-pulse" />
      </div>
    </div>
  );
}

function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  skeletonCount = 8,
  emptyTitle = 'No hay productos para mostrar',
  emptyDescription,
  emptyAction,
}) {
  if (loading) {
    return (
      <div role="status">
        <span className="sr-only">Cargando productos...</span>
        <div aria-hidden="true" className={GRID_CLASSES}>
          {Array.from({ length: skeletonCount }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={onRetry} />;
  }

  if (!products?.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <ul className={GRID_CLASSES}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

export default ProductGrid;
