import { Link } from 'react-router-dom';
import { Pencil, RotateCcw, Star, Trash2 } from 'lucide-react';
import ProductImage from '../product/ProductImage';
import ProductPrice from '../product/ProductPrice';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const ACTION_LINK_CLASSES =
  'focus-ring inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-control border border-control-border bg-white px-4 font-semibold text-ink transition-colors hover:bg-canvas';

function StatusBadge({ active }) {
  return active ? (
    <Badge variant="success">Activo</Badge>
  ) : (
    <Badge variant="neutral">Inactivo</Badge>
  );
}

function FeaturedMark({ featured }) {
  return featured ? (
    <span className="inline-flex items-center gap-1 font-medium text-ink">
      <Star aria-hidden="true" className="h-4 w-4 fill-accent text-ink" />
      Sí
    </span>
  ) : (
    <span className="text-muted">No</span>
  );
}

function StockValue({ stock }) {
  return (
    <span
      className={`whitespace-nowrap ${stock === 0 ? 'font-semibold text-error' : 'text-ink'}`}
    >
      {stock === 0 ? 'Sin stock' : stock}
    </span>
  );
}

function ProductActions({ product, busy, onDeactivate, onReactivate }) {
  return (
    <div className="flex flex-wrap gap-2 xl:flex-nowrap">
      <Link
        to={`/admin/products/${product.id}/edit`}
        state={{ product }}
        className={ACTION_LINK_CLASSES}
      >
        <Pencil aria-hidden="true" className="h-4 w-4" />
        Editar
        <span className="sr-only"> {product.name}</span>
      </Link>
      {product.active ? (
        <Button
          variant="secondary"
          className="whitespace-nowrap px-4"
          onClick={() => onDeactivate(product)}
          disabled={busy}
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
          Dar de baja
          <span className="sr-only"> {product.name}</span>
        </Button>
      ) : (
        <Button
          variant="secondary"
          className="whitespace-nowrap px-4"
          onClick={() => onReactivate(product)}
          loading={busy}
        >
          {!busy && <RotateCcw aria-hidden="true" className="h-4 w-4" />}
          Reactivar
          <span className="sr-only"> {product.name}</span>
        </Button>
      )}
    </div>
  );
}

// Tabla desde xl (1280) y tarjetas debajo: mismo contenido, dos presentaciones.
function ProductTable({ products, busyId, onDeactivate, onReactivate }) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-card border border-border bg-white xl:block">
        <table className="w-full text-left">
          <caption className="sr-only">Productos</caption>
          <thead className="border-b border-border bg-canvas text-sm text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                <span className="sr-only">Imagen</span>
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Nombre
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Categoría
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Precio
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Stock
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Estado
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Destacado
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="align-middle">
                <td className="px-4 py-3">
                  <ProductImage
                    src={product.images?.[0]}
                    alt=""
                    className="h-14 w-14 rounded-control border border-border"
                  />
                </td>
                <th
                  scope="row"
                  className="min-w-48 px-4 py-3 font-medium text-ink"
                >
                  <span className="block">{product.name}</span>
                  <span className="block text-sm font-normal text-muted">
                    {product.brand}
                  </span>
                </th>
                <td className="px-4 py-3 text-ink">
                  {product.category?.name ?? (
                    <span className="text-muted">Sin categoría</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <ProductPrice
                    regularPrice={product.regularPrice}
                    salePrice={product.salePrice}
                    size="sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <StockValue stock={product.stock} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge active={product.active} />
                </td>
                <td className="px-4 py-3">
                  <FeaturedMark featured={product.featured} />
                </td>
                <td className="px-4 py-3">
                  <ProductActions
                    product={product}
                    busy={busyId === product.id}
                    onDeactivate={onDeactivate}
                    onReactivate={onReactivate}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:hidden">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex flex-col gap-4 rounded-card border border-border bg-white p-4"
          >
            <div className="flex gap-4">
              <ProductImage
                src={product.images?.[0]}
                alt=""
                className="h-20 w-20 shrink-0 rounded-control border border-border"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="break-words font-semibold text-ink">
                  {product.name}
                </h3>
                <p className="text-sm text-muted">
                  {product.brand} · {product.category?.name ?? 'Sin categoría'}
                </p>
                <ProductPrice
                  regularPrice={product.regularPrice}
                  salePrice={product.salePrice}
                  size="sm"
                />
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col gap-1">
                <dt className="text-muted">Stock</dt>
                <dd>
                  <StockValue stock={product.stock} />
                </dd>
              </div>
              <div className="flex flex-col items-start gap-1">
                <dt className="text-muted">Estado</dt>
                <dd>
                  <StatusBadge active={product.active} />
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-muted">Destacado</dt>
                <dd>
                  <FeaturedMark featured={product.featured} />
                </dd>
              </div>
            </dl>
            <ProductActions
              product={product}
              busy={busyId === product.id}
              onDeactivate={onDeactivate}
              onReactivate={onReactivate}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default ProductTable;
