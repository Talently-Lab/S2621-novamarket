import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, Plus, X } from 'lucide-react';
import ProductImage from '../product/ProductImage';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import {
  MAX_IMAGES,
  createImageRow,
  createSpecRow,
  imageErrorKey,
  isValidImageUrl,
  mapApiFieldErrors,
  specKeyErrorKey,
  specValueErrorKey,
  toFormValues,
  validateProductForm,
} from '../../utils/productForm';

const SECONDARY_LINK_CLASSES =
  'focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-control border border-control-border bg-white px-6 font-semibold text-ink transition-colors hover:bg-canvas';
const ROW_BUTTON_CLASSES =
  'focus-ring inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-control border border-control-border bg-white text-ink hover:bg-canvas';
const ADD_BUTTON_CLASSES =
  'focus-ring inline-flex h-12 items-center gap-2 self-start rounded-control border border-control-border bg-white px-4 font-semibold text-ink hover:bg-canvas';

function GroupError({ message }) {
  if (!message) return null;

  return (
    <p className="flex items-start gap-2 text-sm text-error">
      <CircleAlert aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-control border border-control-border bg-white p-4">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="focus-ring mt-0.5 h-5 w-5 shrink-0 accent-primary"
      />
      <span className="flex flex-col gap-1">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-sm text-muted">{description}</span>
      </span>
    </label>
  );
}

// Alta y edición de producto. `onSubmit(payload)` hace el POST o el PUT y rechaza con el error normalizado de la API.
function ProductForm({ product, categories, onSubmit, submitLabel }) {
  const formRef = useRef(null);
  const [values, setValues] = useState(() => toFormValues(product));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // Pedido de foco para después del render (primer campo con error, fila nueva, botón "Agregar").
  const [focusTarget, setFocusTarget] = useState(null);

  useEffect(() => {
    if (focusTarget) {
      formRef.current?.querySelector(focusTarget.selector)?.focus();
    }
  }, [focusTarget]);

  const requestFocus = (selector) => setFocusTarget({ selector });

  const clearError = (key) => {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const setField = (name) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    clearError(name);
  };

  const updateImage = (id, url) => {
    setValues((current) => ({
      ...current,
      images: current.images.map((row) =>
        row.id === id ? { ...row, url } : row,
      ),
    }));
    clearError(imageErrorKey(id));
  };

  const addImage = () => {
    const row = createImageRow();
    setValues((current) => ({ ...current, images: [...current.images, row] }));
    requestFocus(`[data-row="${row.id}"]`);
  };

  const removeImage = (id) => {
    setValues((current) => ({
      ...current,
      images: current.images.filter((row) => row.id !== id),
    }));
    clearError(imageErrorKey(id));
    requestFocus('[data-add="images"]');
  };

  const updateSpec = (id, field, text) => {
    setValues((current) => ({
      ...current,
      specs: current.specs.map((row) =>
        row.id === id ? { ...row, [field]: text } : row,
      ),
    }));
    clearError(field === 'key' ? specKeyErrorKey(id) : specValueErrorKey(id));
  };

  const addSpec = () => {
    const row = createSpecRow();
    setValues((current) => ({ ...current, specs: [...current.specs, row] }));
    requestFocus(`[data-row="${row.id}"]`);
  };

  const removeSpec = (id) => {
    setValues((current) => ({
      ...current,
      specs: current.specs.filter((row) => row.id !== id),
    }));
    clearError(specKeyErrorKey(id));
    clearError(specValueErrorKey(id));
    requestFocus('[data-add="specs"]');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    const { errors: clientErrors, payload, meta } = validateProductForm(values);

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setFormError('Revisá los campos marcados.');
      requestFocus('[aria-invalid="true"]');
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await onSubmit(payload);
    } catch (error) {
      setSubmitting(false);

      if (error.code === 'VALIDATION_ERROR') {
        const mapped = mapApiFieldErrors(error.fields, meta);
        setErrors(mapped.errors);
        setFormError(
          [
            Object.keys(mapped.errors).length > 0
              ? 'Revisá los campos marcados.'
              : error.message,
            ...mapped.unmatched,
          ].join(' '),
        );
        requestFocus('[aria-invalid="true"]');
        return;
      }

      setFormError(error.message);
      requestFocus('[data-form-error]');
    }
  };

  const categoryOptions = categories.data ?? [];
  const missingCategory =
    product?.category &&
    categories.data &&
    !categoryOptions.some((category) => category.id === product.category.id)
      ? product.category
      : null;
  const canAddImage = values.images.length < MAX_IMAGES;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      {formError && (
        <div
          tabIndex={-1}
          data-form-error
          className="focus-ring rounded-control"
        >
          <ErrorMessage message={formError} />
        </div>
      )}

      <fieldset className="flex flex-col gap-4 rounded-card border border-border bg-white p-4 md:p-6">
        <legend className="px-1 text-xl font-semibold text-ink">
          Datos del producto
        </legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Nombre"
            name="name"
            value={values.name}
            onChange={setField('name')}
            error={errors.name}
            required
          />
          <Input
            label="Marca"
            name="brand"
            value={values.brand}
            onChange={setField('brand')}
            error={errors.brand}
            required
          />
        </div>
        <Textarea
          label="Descripción"
          name="description"
          value={values.description}
          onChange={setField('description')}
          error={errors.description}
          required
        />
        <Select
          label="Categoría"
          name="category"
          value={values.category}
          onChange={setField('category')}
          error={errors.category}
          disabled={categories.loading || Boolean(categories.error)}
          hint={
            missingCategory
              ? 'La categoría actual ya no está disponible: elegí otra.'
              : undefined
          }
          required
        >
          <option value="">
            {categories.loading
              ? 'Cargando categorías...'
              : 'Elegí una categoría'}
          </option>
          {missingCategory && (
            <option value={missingCategory.id}>
              {missingCategory.name} (no disponible)
            </option>
          )}
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {categories.error && (
          <p role="status" className="text-sm text-muted">
            No se pudieron cargar las categorías.{' '}
            <button
              type="button"
              onClick={categories.refetch}
              className="focus-ring rounded-control font-semibold text-ink underline"
            >
              Reintentar
            </button>
          </p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-card border border-border bg-white p-4 md:p-6">
        <legend className="px-1 text-xl font-semibold text-ink">
          Precio y stock
        </legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Precio regular"
            name="regularPrice"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={values.regularPrice}
            onChange={setField('regularPrice')}
            error={errors.regularPrice}
            required
          />
          <Input
            label="Precio de oferta (opcional)"
            name="salePrice"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={values.salePrice}
            onChange={setField('salePrice')}
            error={errors.salePrice}
            hint="Vacío, sin oferta. Tiene que ser menor que el precio regular."
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={values.stock}
            onChange={setField('stock')}
            error={errors.stock}
            required
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-card border border-border bg-white p-4 md:p-6">
        <legend className="px-1 text-xl font-semibold text-ink">
          Imágenes
        </legend>
        <p className="text-sm text-muted">
          Pegá la URL de cada imagen (por ejemplo, de Cloudinary). Hasta{' '}
          {MAX_IMAGES}; la primera es la principal.
        </p>
        <ul className="flex flex-col gap-4">
          {values.images.map((row, index) => {
            const url = row.url.trim();

            return (
              <li key={row.id} className="flex items-start gap-3">
                <ProductImage
                  key={url}
                  src={url && isValidImageUrl(url) ? url : null}
                  alt=""
                  className="mt-7 h-12 w-12 shrink-0 rounded-control border border-border"
                />
                <div className="min-w-0 flex-1">
                  <Input
                    label={`URL de la imagen ${index + 1}`}
                    name={`image-${index}`}
                    type="url"
                    inputMode="url"
                    placeholder="https://"
                    value={row.url}
                    onChange={(event) =>
                      updateImage(row.id, event.target.value)
                    }
                    error={errors[imageErrorKey(row.id)]}
                    data-row={row.id}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(row.id)}
                  aria-label={`Quitar la imagen ${index + 1}`}
                  className={`${ROW_BUTTON_CLASSES} mt-7`}
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </li>
            );
          })}
        </ul>
        <GroupError message={errors.images} />
        {canAddImage ? (
          <button
            type="button"
            onClick={addImage}
            data-add="images"
            className={ADD_BUTTON_CLASSES}
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
            Agregar imagen
          </button>
        ) : (
          <p tabIndex={-1} data-add="images" className="text-sm text-muted">
            Llegaste al máximo de {MAX_IMAGES} imágenes.
          </p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-card border border-border bg-white p-4 md:p-6">
        <legend className="px-1 text-xl font-semibold text-ink">
          Especificaciones
        </legend>
        <p className="text-sm text-muted">
          Opcionales. Una característica por fila, por ejemplo: Memoria → 8 GB.
        </p>
        <ul className="flex flex-col gap-4">
          {values.specs.map((row, index) => (
            <li
              key={row.id}
              className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:border-0 sm:pb-0"
            >
              <div className="min-w-0 flex-1">
                <Input
                  label={`Característica ${index + 1}`}
                  name={`spec-key-${index}`}
                  value={row.key}
                  onChange={(event) =>
                    updateSpec(row.id, 'key', event.target.value)
                  }
                  error={errors[specKeyErrorKey(row.id)]}
                  data-row={row.id}
                />
              </div>
              <div className="min-w-0 flex-1">
                <Input
                  label={`Valor ${index + 1}`}
                  name={`spec-value-${index}`}
                  value={row.value}
                  onChange={(event) =>
                    updateSpec(row.id, 'value', event.target.value)
                  }
                  error={errors[specValueErrorKey(row.id)]}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSpec(row.id)}
                aria-label={`Quitar la característica ${index + 1}`}
                className={`${ROW_BUTTON_CLASSES} self-end sm:mt-7 sm:self-start`}
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
        <GroupError message={errors.specifications} />
        <button
          type="button"
          onClick={addSpec}
          data-add="specs"
          className={ADD_BUTTON_CLASSES}
        >
          <Plus aria-hidden="true" className="h-5 w-5" />
          Agregar característica
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-card border border-border bg-white p-4 md:p-6">
        <legend className="px-1 text-xl font-semibold text-ink">
          Publicación
        </legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Toggle
            label="Activo"
            description="Visible en la tienda. Si lo desactivás, queda como inactivo."
            checked={values.active}
            onChange={(checked) =>
              setValues((current) => ({ ...current, active: checked }))
            }
          />
          <Toggle
            label="Destacado"
            description="Aparece en la sección de destacados del inicio."
            checked={values.featured}
            onChange={(checked) =>
              setValues((current) => ({ ...current, featured: checked }))
            }
          />
        </div>
        <GroupError message={errors.active} />
        <GroupError message={errors.featured} />
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link to="/admin/products" className={SECONDARY_LINK_CLASSES}>
          Cancelar
        </Link>
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
