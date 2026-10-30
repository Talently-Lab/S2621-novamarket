import { Link } from 'react-router-dom';
import Loader from '../ui/Loader';

// Con error o sin categorías no se muestra: el resto de la Home sigue usable.
function CategoryBanner({ categories, loading, error }) {
  if (loading) {
    return <Loader size="sm" label="Cargando categorías..." />;
  }

  if (error || !categories?.length) {
    return null;
  }

  return (
    <section aria-labelledby="home-categories" className="flex flex-col gap-4">
      <h2 id="home-categories" className="text-2xl font-bold text-ink">
        Categorías
      </h2>
      <ul className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/products?category=${encodeURIComponent(category.id)}`}
              className="focus-ring inline-flex h-12 items-center rounded-full border border-control-border bg-white px-5 font-medium text-ink hover:bg-soft"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CategoryBanner;
