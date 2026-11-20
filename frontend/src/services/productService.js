import api from './api';

const PARAM_NAMES = [
  'search',
  'category',
  'page',
  'limit',
  'featured',
  'offer',
  'active',
];

// Máximo de `limit` que acepta GET /api/products.
const MAX_PAGE_SIZE = 50;

// Solo se envían los parámetros con valor (Contrato API v0.3).
// `active` viaja como texto ('true', 'false' o 'all'), así que el `false` booleano que se descarta acá no lo afecta.
function buildParams(filters) {
  return Object.fromEntries(
    PARAM_NAMES.filter(
      (name) =>
        filters[name] !== undefined &&
        filters[name] !== null &&
        filters[name] !== '' &&
        filters[name] !== false,
    ).map((name) => [name, filters[name]]),
  );
}

// PUT reemplaza el producto completo: se arma siempre el objeto entero, con `category` como id.
export function toProductPayload(product) {
  return {
    name: product.name,
    description: product.description,
    brand: product.brand,
    regularPrice: Number(product.regularPrice),
    salePrice:
      product.salePrice === null ||
      product.salePrice === undefined ||
      product.salePrice === ''
        ? null
        : Number(product.salePrice),
    category:
      typeof product.category === 'object' && product.category !== null
        ? product.category.id
        : (product.category ?? null),
    stock: Number(product.stock),
    images: product.images ?? [],
    specifications: product.specifications ?? {},
    active: Boolean(product.active),
    featured: Boolean(product.featured),
  };
}

async function getProducts(filters = {}, { signal } = {}) {
  const response = await api.get('/products', {
    params: buildParams(filters),
    signal,
  });
  return response.data;
}

// Recorre todas las páginas con el `limit` máximo. Lo usa Admin para métricas y para encontrar inactivos.
async function getAllProducts(filters = {}, { signal } = {}) {
  const first = await getProducts(
    { ...filters, page: 1, limit: MAX_PAGE_SIZE },
    { signal },
  );
  const totalPages = first.pagination?.totalPages ?? 1;

  if (totalPages <= 1) {
    return first.products;
  }

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getProducts(
        { ...filters, page: index + 2, limit: MAX_PAGE_SIZE },
        { signal },
      ),
    ),
  );

  return [first, ...rest].flatMap((data) => data.products);
}

async function getProductById(id, { signal } = {}) {
  const response = await api.get(`/products/${encodeURIComponent(id)}`, {
    signal,
  });
  return response.data;
}

// GET /api/products/:id no devuelve inactivos (ni para ADMIN): Admin busca el producto en el listado completo.
async function findProductForAdmin(id, { signal } = {}) {
  const products = await getAllProducts({ active: 'all' }, { signal });
  return products.find((product) => product.id === id) ?? null;
}

async function createProduct(data) {
  const response = await api.post('/products', toProductPayload(data));
  return response.data;
}

async function updateProduct(id, data) {
  const response = await api.put(
    `/products/${encodeURIComponent(id)}`,
    toProductPayload(data),
  );
  return response.data;
}

// Baja lógica: el Back pone `active = false`.
async function deactivateProduct(id) {
  const response = await api.delete(`/products/${encodeURIComponent(id)}`);
  return response.data;
}

const productService = {
  getProducts,
  getAllProducts,
  getProductById,
  findProductForAdmin,
  createProduct,
  updateProduct,
  deactivateProduct,
};

export default productService;
