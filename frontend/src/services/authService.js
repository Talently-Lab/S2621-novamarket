import api from './api';

async function register(data) {
  const response = await api.post('/auth/register', data);
  return response.data;
}

async function login(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

async function getMe() {
  const response = await api.get('/auth/me');
  return response.data;
}

const authService = { register, login, getMe };

export default authService;
