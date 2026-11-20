import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Plus } from 'lucide-react';
import ProductTable from '../../components/admin/ProductTable';
import SearchBar from '../../components/product/SearchBar';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Loader from '../../components/ui/Loader';
import Notice from '../../components/ui/Notice';
import Pagination from '../../components/ui/Pagination';
import useRequest from '../../hooks/useRequest';
import productService from '../../services/productService';

const PAGE_SIZE = 10;

// Valor del filtro en la URL → parámetro `active` de la API.
const STATUS_FILTERS = [
  { value: 'active', label: 'Activos', api: 'true' },
  { value: 'inactive', label: 'Inactivos', api: 'false' },
  { value: 'all', label: 'Todos', api: 'all' },
];

const OPTION_CLASSES =
  'focus-ring inline-flex h-12 items-center rounded-full border px-5 font-medium transition-colors';
const PRIMARY_LINK_CLASSES =
  'focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-control bg-ink px-6 font-semibold text-white transition-colors hover:bg-hover active:bg-navy';

function parsePage(value) {
  const page = Number.parseInt(value, 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseStatus(value) {
  return STATUS_FILTERS.some((filter) => filter.value === value)
    ? value
    : 'active';
}

function AdminProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const status = parseStatus(searchParams.get('status'));
  const page = parsePage(searchParams.get('page'));
  const apiStatus = STATUS_FILTERS.find(
    (filter) => filter.value === status,
  ).api;
  const filterLabelId = useId();

  // El aviso de alta o edición llega por el state de la navegación desde el formulario.
  const [feedback, setFeedback] = useState(() =>
    location.state?.notice
      ? { variant: 'success', message: location.state.notice }
      : null,
  );
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const feedbackRef = useRef(null);

  // El aviso recibe el foco: la fila que tenía el foco suele desaparecer del listado después de la acción.
  useEffect(() => {
    if (feedback) {
      feedbackRef.current?.focus();
    }
  }, [feedback]);

  // Se limpia el state para que el aviso no reaparezca al recargar o volver atrás.
  useEffect(() => {
    if (location.state?.notice) {
      navigate(
        { pathname: location.pathname, search: location.search },
        { replace: true, state: null },
      );
    }
  }, [location, navigate]);

  const request = useCallback(
    (signal) =>
      productService.getProducts(
        { search, page, limit: PAGE_SIZE, active: apiStatus },
        { signal },
      ),
    [search, page, apiStatus],
  );
  const products = useRequest(request);

  const updateParams = useCallback(
    (changes) => {
      setFeedback(null);
      setSearchParams((current) => {
        const next = new URLSearchParams(current);

        Object.entries(changes).forEach(([name, value]) => {
          if (
            value === '' ||
            value === null ||
            (name === 'page' && value === 1) ||
            (name === 'status' && value === 'active')
          ) {
            next.delete(name);
          } else {
            next.set(name, String(value));
          }
        });

        return next;
      });
    },
    [setSearchParams],
  );

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage });
    window.scrollTo({ top: 0 });
  };

  const openConfirm = (product) => {
    setConfirmError(null);
    setConfirmTarget(product);
  };

  const closeConfirm = () => {
    setConfirmTarget(null);
    setConfirmError(null);
  };

  const handleDeactivate = async () => {
    const product = confirmTarget;
    setConfirming(true);
    setConfirmError(null);

    try {
      await productService.deactivateProduct(product.id);
      setConfirmTarget(null);
      setFeedback({
        variant: 'success',
        message: `"${product.name}" se dio de baja. Ya no se muestra en la tienda.`,
      });
      products.refetch();
    } catch (error) {
      setConfirmError(
        error.code === 'PRODUCT_ALREADY_INACTIVE'
          ? 'El producto ya estaba dado de baja. Actualizá el listado.'
          : error.message,
      );
    } finally {
      setConfirming(false);
    }
  };

  // Reactivar = PUT completo con `active: true` (no hay endpoint propio).
  const handleReactivate = async (product) => {
    setBusyId(product.id);
    setFeedback(null);

    try {
      await productService.updateProduct(product.id, {
        ...product,
        active: true,
      });
      setFeedback({
        variant: 'success',
        message: `"${product.name}" se reactivó y vuelve a mostrarse en la tienda.`,
      });
      products.refetch();
    } catch (error) {
      setFeedback({
        variant: 'error',
        message:
          error.code === 'VALIDATION_ERROR'
            ? `No se pudo reactivar "${product.name}": revisá sus datos (por ejemplo, la categoría) desde Editar.`
            : error.message,
      });
    } finally {
      setBusyId(null);
    }
  };

  const pagination = products.data?.pagination;
  const list = products.data?.products ?? [];
  const total = pagination?.total ?? 0;
  const pageOutOfRange = total > 0 && page > pagination.totalPages;
  const hasFilters = Boolean(search || status !== 'active');

  let content;

  if (products.loading) {
    content = <Loader label="Cargando productos..." />;
  } else if (products.error) {
    content = (
      <ErrorMessage
        message={products.error.message}
        onRetry={products.refetch}
      />
    );
  } else if (list.length === 0) {
    content = pageOutOfRange ? (
      <EmptyState
        title="Esta página no tiene productos"
        description={`Los resultados llegan hasta la página ${pagination.totalPages}.`}
        action={
          <Button variant="secondary" onClick={() => handlePageChange(1)}>
            Ir a la primera página
          </Button>
        }
      />
    ) : (
      <EmptyState
        title="No hay productos para mostrar"
        description={
          hasFilters
            ? 'Probá con otra búsqueda o con otro estado.'
            : 'Todavía no cargaste productos.'
        }
        action={
          hasFilters ? (
            <Button
              variant="secondary"
              onClick={() =>
                updateParams({ search: null, status: null, page: null })
              }
            >
              Limpiar filtros
            </Button>
          ) : (
            <Link to="/admin/products/new" className={PRIMARY_LINK_CLASSES}>
              Crear producto
            </Link>
          )
        }
      />
    );
  } else {
    content = (
      <ProductTable
        products={list}
        busyId={busyId}
        onDeactivate={openConfirm}
        onReactivate={handleReactivate}
      />
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-ink">Productos</h1>
          <p role="status" className="text-muted">
            {products.data &&
              `${total} ${total === 1 ? 'producto' : 'productos'}`}
          </p>
        </div>
        <Link to="/admin/products/new" className={PRIMARY_LINK_CLASSES}>
          <Plus aria-hidden="true" className="h-5 w-5" />
          Nuevo producto
        </Link>
      </div>

      <div className="flex flex-col gap-4 rounded-card border border-border bg-white p-4 md:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <span id={filterLabelId} className="text-sm font-medium text-ink">
            Estado
          </span>
          <div
            role="group"
            aria-labelledby={filterLabelId}
            className="flex flex-wrap gap-2"
          >
            {STATUS_FILTERS.map((filter) => {
              const selected = status === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    updateParams({ status: filter.value, page: null })
                  }
                  className={`${OPTION_CLASSES} ${selected ? 'border-ink bg-ink text-white' : 'border-control-border bg-white text-ink hover:bg-canvas'}`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="w-full lg:max-w-sm">
          <SearchBar
            key={search}
            value={search}
            placeholder="Buscar en el panel"
            onSearch={(term) => updateParams({ search: term, page: null })}
          />
        </div>
      </div>

      {feedback && (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          className="focus-ring rounded-control"
        >
          {feedback.variant === 'success' ? (
            <Notice variant="success">{feedback.message}</Notice>
          ) : (
            <ErrorMessage message={feedback.message} />
          )}
        </div>
      )}

      {content}

      {pagination && !products.loading && !products.error && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={handlePageChange}
        />
      )}

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="¿Dar de baja este producto?"
        description={
          confirmTarget &&
          `"${confirmTarget.name}" dejará de mostrarse en la tienda. Podés reactivarlo después desde el filtro Inactivos.`
        }
        confirmLabel="Dar de baja"
        onConfirm={handleDeactivate}
        onCancel={closeConfirm}
        loading={confirming}
        error={confirmError}
      />
    </section>
  );
}

export default AdminProducts;
