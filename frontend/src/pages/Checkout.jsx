import Notice from '../components/ui/Notice';
import useAuth from '../hooks/useAuth';

function Checkout() {
  const { isAdmin } = useAuth();

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">Checkout</h1>
      {/* El contrato restringe la compra al rol CLIENT: el admin ve un aviso en lugar de comprar. */}
      {isAdmin && (
        <Notice>
          Los administradores no pueden comprar. Para hacer un pedido, ingresá
          con una cuenta de cliente.
        </Notice>
      )}
    </section>
  );
}

export default Checkout;
