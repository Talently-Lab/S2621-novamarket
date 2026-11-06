import ProductGrid from '../product/ProductGrid';

// Sin productos en oferta la sección no se muestra.
function Offers({ products, loading, error, onRetry }) {
  if (!loading && !error && !products?.length) {
    return null;
  }

  return (
    <section aria-labelledby="home-offers" className="flex flex-col gap-4">
      <h2 id="home-offers" className="text-2xl font-bold text-ink">
        Ofertas
      </h2>
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

export default Offers;
