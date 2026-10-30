import api from './api';

async function getCategories({ signal } = {}) {
  const response = await api.get('/categories', { signal });
  return response.data;
}

const categoryService = { getCategories };

export default categoryService;
