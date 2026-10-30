import { Link } from 'react-router-dom';
import CategoryBanner from '../components/home/CategoryBanner';
import FeaturedProducts from '../components/home/FeaturedProducts';
import useCategories from '../hooks/useCategories';
import useProducts from '../hooks/useProducts';

const FEATURED_LIMIT = 4;

function Home() {
  const categories = useCategories();
  const featured = useProducts({ featured: true, limit: FEATURED_LIMIT });

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-start gap-4 rounded-card bg-ink px-6 py-10 text-white md:px-12 md:py-14">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Tecnología y electrónica
        </h1>
        <p className="max-w-xl text-lg">
          Comprá los productos de NovaMarket directamente en su tienda online.
        </p>
        <Link
          to="/products"
          className="focus-ring inline-flex h-12 items-center rounded-control bg-accent px-6 font-semibold text-ink hover:underline"
        >
          Ver catálogo
        </Link>
      </section>

      <CategoryBanner
        categories={categories.data}
        loading={categories.loading}
        error={categories.error}
      />

      <FeaturedProducts
        products={featured.data?.products}
        loading={featured.loading}
        error={featured.error}
        onRetry={featured.refetch}
      />
    </div>
  );
}

export default Home;
