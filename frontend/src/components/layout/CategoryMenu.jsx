import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronDown, LoaderCircle } from 'lucide-react';
import useCategories from '../../hooks/useCategories';
import Loader from '../ui/Loader';

const NAVIGATION_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

const categoryPath = (id) => `/products?category=${encodeURIComponent(id)}`;

// Carga, error y vacío se muestran dentro del menú: el resto del Navbar sigue usable.
// `dark` es la variante sobre el fondo ink del menú mobile.
function CategoryStatus({ loading, error, isEmpty, onRetry, dark }) {
  const textClasses = dark ? 'text-white' : 'text-muted';

  if (loading) {
    return dark ? (
      <p
        role="status"
        className="flex items-center gap-2 py-3 text-sm text-white"
      >
        <LoaderCircle
          aria-hidden="true"
          className="h-4 w-4 motion-safe:animate-spin"
        />
        Cargando categorías...
      </p>
    ) : (
      <div className="px-4 py-3">
        <Loader size="sm" label="Cargando categorías..." />
      </div>
    );
  }

  if (error) {
    return (
      <p
        role="status"
        className={`py-3 text-sm ${textClasses} ${dark ? '' : 'px-4'}`}
      >
        No se pudieron cargar las categorías.{' '}
        <button
          type="button"
          onClick={onRetry}
          className={`focus-ring rounded-control font-semibold underline ${dark ? 'text-white' : 'text-ink'}`}
        >
          Reintentar
        </button>
      </p>
    );
  }

  if (isEmpty) {
    return (
      <p
        role="status"
        className={`py-3 text-sm ${textClasses} ${dark ? '' : 'px-4'}`}
      >
        No hay categorías disponibles.
      </p>
    );
  }

  return null;
}

// Menú de categorías del Navbar: en desktop, un botón que abre un panel; en mobile, una lista dentro del menú colapsable.
// Cada opción navega a /products?category=<id> (FE-03).
function CategoryMenu({ onNavigate }) {
  const { data: categories, loading, error, refetch } = useCategories();
  const [open, setOpen] = useState(false);
  const focusFirstRef = useRef(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const panelId = useId();
  const mobileLabelId = useId();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentCategory =
    location.pathname === '/products' ? searchParams.get('category') : null;
  const hasCategories = !loading && !error && Boolean(categories?.length);
  const isEmpty = !loading && !error && !categories?.length;

  const getItems = () =>
    Array.from(containerRef.current?.querySelectorAll('a') ?? []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  // Al abrir con la flecha abajo, el foco pasa a la primera categoría apenas están cargadas.
  useEffect(() => {
    if (open && focusFirstRef.current && categories?.length) {
      focusFirstRef.current = false;
      containerRef.current?.querySelector('a')?.focus();
    }
  }, [open, categories]);

  const handleNavigate = () => {
    setOpen(false);
    onNavigate?.();
  };

  const handleButtonKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (open) {
        getItems()[0]?.focus();
      } else {
        focusFirstRef.current = true;
        setOpen(true);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (!open) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }

    const items = getItems();
    const index = items.indexOf(document.activeElement);

    if (index === -1 || !NAVIGATION_KEYS.includes(event.key)) {
      return;
    }

    event.preventDefault();
    const last = items.length - 1;
    const next = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    items[next].focus();
  };

  // Si el foco sale del menú con Tab, se cierra. Los clics afuera los cubre el pointerdown.
  const handleBlur = (event) => {
    if (
      event.relatedTarget &&
      !containerRef.current?.contains(event.relatedTarget)
    ) {
      setOpen(false);
    }
  };

  const renderLinks = (linkClasses, activeClasses) => (
    <ul className="flex flex-col">
      {categories.map((category) => {
        const active = currentCategory === category.id;

        return (
          <li key={category.id}>
            <Link
              to={categoryPath(category.id)}
              onClick={handleNavigate}
              aria-current={active ? 'page' : undefined}
              className={`${linkClasses} ${active ? activeClasses : ''}`}
            >
              {category.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="relative hidden lg:block"
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((current) => !current)}
          onKeyDown={handleButtonKeyDown}
          aria-expanded={open}
          aria-controls={panelId}
          className="focus-ring inline-flex h-12 items-center gap-1 rounded-control font-medium text-white hover:underline"
        >
          Categorías
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 motion-safe:transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        <div
          id={panelId}
          hidden={!open}
          className="absolute left-0 top-full z-20 mt-2 w-72 rounded-card border border-border bg-white py-2 shadow-lg"
        >
          {open && (
            <>
              <CategoryStatus
                loading={loading}
                error={error}
                isEmpty={isEmpty}
                onRetry={refetch}
              />
              {hasCategories &&
                renderLinks(
                  'focus-ring flex min-h-12 items-center px-4 py-2 font-medium text-ink hover:bg-soft focus-visible:ring-inset focus-visible:ring-offset-0',
                  'bg-soft font-semibold',
                )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:hidden">
        <span
          id={mobileLabelId}
          className="pt-2 text-sm font-semibold uppercase tracking-wide text-white"
        >
          Categorías
        </span>
        <div role="group" aria-labelledby={mobileLabelId} className="pl-4">
          <CategoryStatus
            loading={loading}
            error={error}
            isEmpty={isEmpty}
            onRetry={refetch}
            dark
          />
          {hasCategories &&
            renderLinks(
              'focus-ring inline-flex h-12 items-center rounded-control font-medium text-white hover:underline',
              'underline underline-offset-4',
            )}
        </div>
      </div>
    </>
  );
}

export default CategoryMenu;
