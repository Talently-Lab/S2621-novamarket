import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import Input from '../components/ui/Input';
import Notice from '../components/ui/Notice';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import orderService from '../services/orderService';

const FIELDS = ['fullName', 'address'];
const MIN_ADDRESS_LENGTH = 5;
const GENERIC_ORDER_ERROR = {
  status: null,
  code: null,
  message: 'No pudimos crear tu pedido. Intentá de nuevo en unos minutos.',
};
const TEXT_LINK_CLASSES =
  'focus-ring self-start rounded-control font-semibold text-ink underline';

// TODO: los datos de envío no forman parte de POST /api/orders en el Contrato API v0.3.
// Por ahora solo se validan en el cliente y no se envían; queda pendiente definir con Back End si la orden los recibe y en qué formato.
function validate({ fullName, address }) {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = 'Ingresá el nombre de quien recibe el pedido.';
  }

  if (!address.trim()) {
    errors.address = 'Ingresá la dirección de envío.';
  } else if (address.trim().length < MIN_ADDRESS_LENGTH) {
    errors.address = 'Ingresá la dirección completa: calle, número y ciudad.';
  }

  return errors;
}

// Mensaje y acción según el código de error del contrato. En todos los casos el carrito queda intacto.
function OrderError({ error }) {
  const reviewCart = (
    <Link to="/cart" className={TEXT_LINK_CLASSES}>
      Revisar el carrito
    </Link>
  );

  if (error.code === 'INSUFFICIENT_STOCK') {
    return (
      <ErrorMessage
        message={`${error.message} Revisá las cantidades de tu carrito y volvé a intentar.`}
        action={reviewCart}
      />
    );
  }

  if (error.code === 'PRODUCT_NOT_FOUND') {
    return (
      <ErrorMessage
        message={`${error.message} Quitá ese producto del carrito para continuar.`}
        action={reviewCart}
      />
    );
  }

  return <ErrorMessage message={error.message} />;
}

function Checkout() {
  const { user, isAdmin } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [values, setValues] = useState(() => ({
    fullName: [user?.name, user?.lastName].filter(Boolean).join(' '),
    address: '',
  }));
  const [fieldErrors, setFieldErrors] = useState({});
  const [orderError, setOrderError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // El contrato restringe la compra al rol CLIENT: el admin ve un aviso en lugar de comprar.
  if (isAdmin) {
    return (
      <section className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-ink">Checkout</h1>
        <Notice>
          Los administradores no pueden comprar. Para hacer un pedido, ingresá
          con una cuenta de cliente.
        </Notice>
        <Link to="/cart" className={TEXT_LINK_CLASSES}>
          Volver al carrito
        </Link>
      </section>
    );
  }

  // Después del 201 el carrito se vacía al navegar a la orden; mientras tanto no se redirige al catálogo.
  if (items.length === 0 && !submitting) {
    return <Navigate to="/products" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const errors = validate(values);
    const firstInvalid = FIELDS.find((field) => errors[field]);

    setFieldErrors(errors);
    setOrderError(null);

    if (firstInvalid) {
      form.elements.namedItem(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);

    try {
      const data = await orderService.createOrder(items);
      const orderId = data?.order?.id;

      if (!orderId) {
        throw GENERIC_ORDER_ERROR;
      }

      // Solo con el 201 se vacía el carrito.
      navigate(`/orders/${orderId}`, {
        replace: true,
        state: { created: true },
      });
      clearCart();
    } catch (error) {
      setOrderError(error?.message ? error : GENERIC_ORDER_ERROR);
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">Checkout</h1>

      {orderError && <OrderError error={orderError} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="flex flex-col gap-6">
          <form
            id="checkout-form"
            noValidate
            onSubmit={handleSubmit}
            aria-labelledby="checkout-shipping"
            className="flex flex-col gap-4 rounded-card border border-border bg-white p-6"
          >
            <div className="flex flex-col gap-1">
              <h2
                id="checkout-shipping"
                className="text-xl font-semibold text-ink"
              >
                Datos de envío
              </h2>
              <p className="text-sm text-muted">
                Los usamos para coordinar la entrega de tu pedido.
              </p>
            </div>
            <fieldset disabled={submitting} className="flex flex-col gap-4">
              <Input
                label="Nombre y apellido"
                name="fullName"
                autoComplete="name"
                value={values.fullName}
                onChange={handleChange}
                error={fieldErrors.fullName}
                required
              />
              <Input
                label="Dirección de envío"
                name="address"
                autoComplete="street-address"
                hint="Calle, número, piso o departamento y ciudad."
                value={values.address}
                onChange={handleChange}
                error={fieldErrors.address}
                required
              />
            </fieldset>
          </form>

          <section
            aria-labelledby="checkout-items"
            className="flex flex-col gap-3 rounded-card border border-border bg-white p-6"
          >
            <h2 id="checkout-items" className="text-xl font-semibold text-ink">
              Tu pedido
            </h2>
            <ul className="flex flex-col divide-y divide-border">
              {items.map((item) => (
                <li key={item.productId} className="py-3">
                  <CartItem item={item} readOnly />
                </li>
              ))}
            </ul>
            {!submitting && (
              <Link to="/cart" className={TEXT_LINK_CLASSES}>
                Modificar el carrito
              </Link>
            )}
          </section>
        </div>

        <CartSummary>
          {/* El botón ya muestra el estado; esta región lo anuncia a los lectores de pantalla. */}
          <p role="status" className="sr-only">
            {submitting
              ? 'Estamos creando tu pedido. No cierres esta página.'
              : ''}
          </p>
          <Button
            type="submit"
            form="checkout-form"
            loading={submitting}
            className="w-full"
          >
            {submitting ? 'Estamos creando tu pedido' : 'Confirmar compra'}
          </Button>
        </CartSummary>
      </div>
    </section>
  );
}

export default Checkout;
