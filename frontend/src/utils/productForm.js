// Reglas del formulario de producto de Admin, espejo de las validaciones de POST/PUT /api/products.

export const MAX_IMAGES = 5;

let lastRowId = 0;

function nextRowId(prefix) {
  lastRowId += 1;
  return `${prefix}-${lastRowId}`;
}

export function createImageRow(url = '') {
  return { id: nextRowId('img'), url };
}

export function createSpecRow(key = '', value = '') {
  return { id: nextRowId('spec'), key, value };
}

function specValueToText(value) {
  if (value === null || value === undefined) return '';
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

// Producto de la API → valores del formulario (todo texto, salvo los booleanos y las filas).
export function toFormValues(product) {
  const images = (product?.images ?? []).map((url) => createImageRow(url));
  const specs = Object.entries(product?.specifications ?? {}).map(
    ([key, value]) => createSpecRow(key, specValueToText(value)),
  );

  return {
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    description: product?.description ?? '',
    category: product?.category?.id ?? '',
    regularPrice:
      product?.regularPrice === undefined ? '' : String(product.regularPrice),
    salePrice:
      product?.salePrice === null || product?.salePrice === undefined
        ? ''
        : String(product.salePrice),
    stock: product?.stock === undefined ? '' : String(product.stock),
    images: images.length > 0 ? images : [createImageRow()],
    specs: specs.length > 0 ? specs : [createSpecRow()],
    featured: Boolean(product?.featured),
    active: product ? Boolean(product.active) : true,
  };
}

function parseNumber(text) {
  const trimmed = String(text).trim();
  if (trimmed === '') return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : Number.NaN;
}

// URL absoluta http(s) (por ejemplo, Cloudinary) o ruta relativa del Back (/uploads/...).
export function isValidImageUrl(text) {
  const value = text.trim();

  if (value.startsWith('/') && !value.startsWith('//')) {
    return !/\s/.test(value);
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const imageErrorKey = (rowId) => `images.${rowId}`;
export const specKeyErrorKey = (rowId) => `specs.${rowId}.key`;
export const specValueErrorKey = (rowId) => `specs.${rowId}.value`;

// Devuelve { errors, payload, meta }. `payload` solo es válido si `errors` está vacío.
// `meta` guarda qué fila originó cada imagen y cada clave, para ubicar los errores de la API.
export function validateProductForm(values) {
  const errors = {};
  const name = values.name.trim();
  const brand = values.brand.trim();
  const description = values.description.trim();

  if (!name) errors.name = 'Ingresá el nombre.';
  if (!brand) errors.brand = 'Ingresá la marca.';
  if (!description) errors.description = 'Ingresá la descripción.';
  if (!values.category) errors.category = 'Elegí una categoría.';

  const regularPrice = parseNumber(values.regularPrice);
  if (regularPrice === null) {
    errors.regularPrice = 'Ingresá el precio.';
  } else if (Number.isNaN(regularPrice) || regularPrice <= 0) {
    errors.regularPrice = 'El precio tiene que ser un número mayor a 0.';
  }

  const salePrice = parseNumber(values.salePrice);
  if (salePrice !== null) {
    if (Number.isNaN(salePrice) || salePrice <= 0) {
      errors.salePrice =
        'El precio de oferta tiene que ser un número mayor a 0.';
    } else if (!errors.regularPrice && salePrice >= regularPrice) {
      errors.salePrice =
        'El precio de oferta tiene que ser menor que el precio regular.';
    }
  }

  const stock = parseNumber(values.stock);
  if (stock === null) {
    errors.stock = 'Ingresá el stock.';
  } else if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = 'El stock tiene que ser un número entero igual o mayor a 0.';
  }

  const imageRows = values.images.filter((row) => row.url.trim() !== '');
  imageRows.forEach((row) => {
    if (!isValidImageUrl(row.url)) {
      errors[imageErrorKey(row.id)] =
        'Ingresá una URL válida, que empiece con https://';
    }
  });
  if (imageRows.length > MAX_IMAGES) {
    errors.images = `Podés cargar hasta ${MAX_IMAGES} imágenes.`;
  }

  const specifications = {};
  const specRowByKey = {};
  values.specs.forEach((row) => {
    const key = row.key.trim();
    const value = row.value.trim();

    if (!key && !value) return;

    if (!key) {
      errors[specKeyErrorKey(row.id)] =
        'Ingresá el nombre de la característica.';
    } else if (Object.hasOwn(specifications, key)) {
      errors[specKeyErrorKey(row.id)] = 'Esta característica está repetida.';
    }

    if (!value) {
      errors[specValueErrorKey(row.id)] = 'Ingresá el valor.';
    }

    if (key && value && !Object.hasOwn(specifications, key)) {
      specifications[key] = value;
      specRowByKey[key] = row.id;
    }
  });

  const payload = {
    name,
    description,
    brand,
    regularPrice,
    salePrice,
    category: values.category,
    stock,
    images: imageRows.map((row) => row.url.trim()),
    specifications,
    active: values.active,
    featured: values.featured,
  };

  return {
    errors,
    payload,
    meta: { imageRowIds: imageRows.map((row) => row.id), specRowByKey },
  };
}

const FORM_FIELDS = [
  'name',
  'brand',
  'description',
  'category',
  'regularPrice',
  'salePrice',
  'stock',
  'images',
  'specifications',
  'active',
  'featured',
];

function toMessage(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(' ');
  if (value && typeof value === 'object') return value.message ?? '';
  return typeof value === 'string' ? value : '';
}

// `fields` de un VALIDATION_ERROR → errores del formulario. Acepta objeto ({ campo: mensaje })
// o lista ([{ field, message }]) y claves con índice ("images.0") o con clave ("specifications.Memoria").
export function mapApiFieldErrors(fields, meta) {
  const entries = Array.isArray(fields)
    ? fields.map((item) => [item?.field ?? item?.path, item])
    : Object.entries(fields ?? {});
  const errors = {};
  const unmatched = [];

  entries.forEach(([rawKey, rawValue]) => {
    const message = toMessage(rawValue);
    if (!message) return;

    const [root, ...rest] = String(rawKey ?? '')
      .replace(/\[(\w+)\]/g, '.$1')
      .split('.');
    const sub = rest.join('.');

    if (root === 'images' && sub !== '' && meta.imageRowIds[Number(sub)]) {
      errors[imageErrorKey(meta.imageRowIds[Number(sub)])] = message;
    } else if (root === 'specifications' && meta.specRowByKey[sub]) {
      errors[specValueErrorKey(meta.specRowByKey[sub])] = message;
    } else if (FORM_FIELDS.includes(root)) {
      errors[root] = errors[root] ? `${errors[root]} ${message}` : message;
    } else {
      unmatched.push(message);
    }
  });

  return { errors, unmatched };
}
