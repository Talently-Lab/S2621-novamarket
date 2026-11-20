import { useCallback } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';
import EmptyState from '../../components/ui/EmptyState';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Loader from '../../components/ui/Loader';
import useCategories from '../../hooks/useCategories';
import useRequest from '../../hooks/useRequest';
import productService from '../../services/productService';

const BACK_LINK_CLASSES =
  'focus-ring inline-flex items-center gap-1 self-start rounded-control font-semibold text-ink underline';
const PRIMARY_LINK_CLASSES =
  'focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-control bg-ink px-6 font-semibold text-white transition-colors hover:bg-hover active:bg-navy';

function AdminProductEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const categories = useCategories();

  // El listado pasa el producto por el state de la navegación. Si no está (recarga o enlace directo),
  // se busca en GET /api/products?active=all, porque GET /api/products/:id no devuelve inactivos.
  const stateProduct =
    location.state?.product?.id === id ? location.state.product : null;
  const request = useCallback(
    (signal) =>
      stateProduct
        ? Promise.resolve(stateProduct)
        : productService.findProductForAdmin(id, { signal }),
    [id, stateProduct],
  );
  const { data: product, loading, error, refetch } = useRequest(request);

  const handleSubmit = async (payload) => {
    const data = await productService.updateProduct(id, payload);
    const name = data?.product?.name ?? payload.name;
    navigate('/admin/products?status=all', {
      state: { notice: `Los cambios de "${name}" se guardaron.` },
    });
  };

  let content;

  if (loading) {
    content = <Loader label="Cargando producto..." />;
  } else if (error) {
    content = <ErrorMessage message={error.message} onRetry={refetch} />;
  } else if (!product) {
    content = (
      <EmptyState
        title="Producto no encontrado"
        description="El producto que querés editar no existe."
        action={
          <Link to="/admin/products" className={PRIMARY_LINK_CLASSES}>
            Ir a productos
          </Link>
        }
      />
    );
  } else {
    content = (
      <ProductForm
        key={product.id}
        product={product}
        categories={categories}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
      />
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <Link to="/admin/products" className={BACK_LINK_CLASSES}>
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        Volver a productos
      </Link>
      <h1 className="text-3xl font-bold text-ink">
        Editar producto
        {product && (
          <span className="block text-lg font-medium text-muted">
            {product.name}
          </span>
        )}
      </h1>
      {content}
    </section>
  );
}

export default AdminProductEdit;
