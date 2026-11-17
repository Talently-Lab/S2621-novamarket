// Back sirve /uploads en su host, fuera de /api (FE-04). VITE_ASSETS_URL lo sobrescribe si hace falta.
const ASSETS_URL = (
  import.meta.env.VITE_ASSETS_URL ||
  (import.meta.env.VITE_API_URL ?? '').replace(/\/api\/?$/, '')
).replace(/\/$/, '');

// Convierte un valor de `images` en URL: las absolutas (Cloudinary) pasan sin cambios y las rutas relativas (por ejemplo, /uploads/products/x.webp) se completan con el host de Back.
export function getImageUrl(path) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${ASSETS_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
