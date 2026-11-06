import { Link } from 'react-router-dom';
import ProductGrid from '../product/ProductGrid';

// Sin productos destacados la sección no se muestra.
function FeaturedProducts({ products, loading, error, onRetry }) {
  if (!loading && !error && !products?.length) {
    return null;
  }

  return (
    <section aria-labelledby="home-featured" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="home-featured" className="text-2xl font-bold text-ink">
          Destacados
        </h2>
        <Link
          to="/products"
          className="focus-ring rounded-control font-semibold text-ink underline"
        >
          Ver todo el catálogo
        </Link>
      </div>
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={onRetry}
        skeletonCount={4}
      />
    </section>
  );
}

export default FeaturedProducts;
