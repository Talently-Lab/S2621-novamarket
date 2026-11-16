import api from './api';

// Contrato API v0.3: el body lleva solo productId y quantity. Precios y totales los calcula el Back.
async function createOrder(items) {
  const response = await api.post('/orders', {
    items: items.map(({ productId, quantity }) => ({ productId, quantity })),
  });
  return response.data;
}

// ADMIN recibe todas las órdenes, sin paginación.
async function getOrders({ signal } = {}) {
  const response = await api.get('/orders', { signal });
  return response.data;
}

async function getOrderById(id, { signal } = {}) {
  const response = await api.get(`/orders/${encodeURIComponent(id)}`, {
    signal,
  });
  return response.data;
}

const orderService = { createOrder, getOrders, getOrderById };

export default orderService;
