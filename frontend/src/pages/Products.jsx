import { useCallback, useEffect, useId, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import CategoryFilter from '../components/product/CategoryFilter';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import useCategories from '../hooks/useCategories';
import useProducts from '../hooks/useProducts';

const SEARCH_DELAY_MS = 400;

function parsePage(value) {
  const page = Number.parseInt(value, 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function Products() {
  const searchId = useId();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const page = parsePage(searchParams.get('page'));

  const products = useProducts({ search, category, page });
  const categories = useCategories();

  // Búsqueda, categoría y página viven en la URL; cambiar un filtro vuelve a la página 1.
  const updateParams = useCallback(
    (changes, options) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);

        Object.entries(changes).forEach(([name, value]) => {
          if (value === '' || value === null || value === 1) {
            next.delete(name);
          } else {
            next.set(name, String(value));
          }
        });

        return next;
      }, options);
    },
    [setSearchParams],
  );

  // `term` es lo que se escribe; `pushedTerm` es lo último que este campo llevó a la URL.
  // Si la URL cambia por otro lado (Navbar, atrás/adelante, limpiar), el campo se sincroniza.
  const [term, setTerm] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  const [pushedTerm, setPushedTerm] = useState(null);

  if (search !== syncedSearch) {
    setSyncedSearch(search);

    if (search === pushedTerm) {
      setPushedTerm(null);
    } else {
      setTerm(search);
    }
  }

  useEffect(() => {
    const value = term.trim();

    if (value === search) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setPushedTerm(value);
      updateParams({ search: value, page: null }, { replace: true });
    }, SEARCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [term, search, updateParams]);

  const hasFilters = Boolean(search || category || page > 1);

  const clearFilters = () => {
    setTerm('');
    updateParams({ search: null, category: null, page: null });
  };

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage });
    window.scrollTo({ top: 0 });
  };

  const pagination = products.data?.pagination;
  const total = pagination?.total ?? 0;
  // Una página fuera de rango (por ejemplo, ?page=9 en la URL) llega vacía aunque haya resultados.
  const pageOutOfRange = total > 0 && page > pagination.totalPages;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-ink">Catálogo</h1>
        <p role="status" className="text-muted">
          {products.data &&
            `${total} ${total === 1 ? 'producto encontrado' : 'productos encontrados'}`}
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-card border border-border bg-white p-4 md:p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor={searchId} className="text-sm font-medium text-ink">
            Buscar en el catálogo
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            />
            <input
              id={searchId}
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Nombre, marca o descripción"
              className="focus-ring h-12 w-full rounded-control border border-control-border bg-canvas pl-12 pr-4 text-ink placeholder:text-muted"
            />
          </div>
        </div>

        <CategoryFilter
          categories={categories.data}
          value={category}
          onChange={(id) => updateParams({ category: id, page: null })}
          loading={categories.loading}
          error={categories.error}
          onRetry={categories.refetch}
        />

        {hasFilters && (
          <div>
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      <ProductGrid
        products={products.data?.products}
        loading={products.loading}
        error={products.error}
        onRetry={products.refetch}
        {...(pageOutOfRange
          ? {
              emptyTitle: 'Esta página no tiene productos',
              emptyDescription: `Los resultados llegan hasta la página ${pagination.totalPages}.`,
              emptyAction: (
                <Button variant="secondary" onClick={() => handlePageChange(1)}>
                  Ir a la primera página
                </Button>
              ),
            }
          : {
              emptyTitle: 'No encontramos productos',
              emptyDescription: hasFilters
                ? 'Probá con otra búsqueda o con otra categoría.'
                : 'Todavía no hay productos publicados.',
              emptyAction: hasFilters && (
                <Button variant="secondary" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              ),
            })}
      />

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}

export default Products;
