import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';
import useCategories from '../../hooks/useCategories';
import productService from '../../services/productService';

const BACK_LINK_CLASSES =
  'focus-ring inline-flex items-center gap-1 self-start rounded-control font-semibold text-ink underline';

function AdminProductCreate() {
  const navigate = useNavigate();
  const categories = useCategories();

  const handleSubmit = async (payload) => {
    const data = await productService.createProduct(payload);
    const name = data?.product?.name ?? payload.name;
    navigate('/admin/products?status=all', {
      state: { notice: `"${name}" se creó correctamente.` },
    });
  };

  return (
    <section className="flex flex-col gap-6">
      <Link to="/admin/products" className={BACK_LINK_CLASSES}>
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        Volver a productos
      </Link>
      <h1 className="text-3xl font-bold text-ink">Nuevo producto</h1>
      <ProductForm
        product={null}
        categories={categories}
        onSubmit={handleSubmit}
        submitLabel="Crear producto"
      />
    </section>
  );
}

export default AdminProductCreate;
