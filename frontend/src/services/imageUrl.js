// Back sirve /uploads en su host, fuera de /api (FE-04). VITE_ASSETS_URL lo sobrescribe si hace falta.
const ASSETS_URL = (
  import.meta.env.VITE_ASSETS_URL ||
  (import.meta.env.VITE_API_URL ?? '').replace(/\/api\/?$/, '')
).replace(/\/$/, '');

// Convierte una ruta relativa de `images` (por ejemplo, /uploads/products/x.webp) en URL completa.
export function getImageUrl(path) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${ASSETS_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
