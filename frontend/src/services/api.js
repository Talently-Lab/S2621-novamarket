import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'token';

const SESSION_ERROR_CODES = ['INVALID_TOKEN', 'TOKEN_EXPIRED'];
const GENERIC_ERROR_MESSAGE =
  'Ocurrió un error inesperado. Intentá de nuevo en unos minutos.';
const NETWORK_ERROR_MESSAGE =
  'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.';

let unauthorizedHandler = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// AuthProvider registra acá la limpieza de sesión para los 401 de token inválido o vencido.
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

// Normaliza cualquier error de Axios a { status, code, message, fields }.
export function getApiError(error) {
  const response = error?.response;

  if (!response) {
    return {
      status: null,
      code: null,
      message: NETWORK_ERROR_MESSAGE,
      fields: {},
    };
  }

  const apiError = response.data?.error;

  if (typeof apiError?.code !== 'string') {
    return {
      status: response.status,
      code: null,
      message: GENERIC_ERROR_MESSAGE,
      fields: {},
    };
  }

  return {
    status: response.status,
    code: apiError.code,
    message: apiError.message || GENERIC_ERROR_MESSAGE,
    fields: apiError.fields ?? {},
  };
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = getApiError(error);

    if (
      apiError.status === 401 &&
      SESSION_ERROR_CODES.includes(apiError.code) &&
      unauthorizedHandler
    ) {
      unauthorizedHandler(apiError);
    }

    return Promise.reject(apiError);
  },
);

export default api;
