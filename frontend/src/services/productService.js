import api from './api';

const PARAM_NAMES = [
  'search',
  'category',
  'page',
  'limit',
  'featured',
  'offer',
];

// Solo se envían los parámetros con valor (Contrato API v0.3).
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

async function getProducts(filters = {}, { signal } = {}) {
  const response = await api.get('/products', {
    params: buildParams(filters),
    signal,
  });
  return response.data;
}

async function getProductById(id, { signal } = {}) {
  const response = await api.get(`/products/${encodeURIComponent(id)}`, {
    signal,
  });
  return response.data;
}

const productService = { getProducts, getProductById };

export default productService;
