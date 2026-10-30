import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';

const PRIMARY_LINK_CLASSES =
  'focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-control bg-ink px-6 font-semibold text-white transition-colors hover:bg-hover active:bg-navy';

// Con el rewrite de Vercel, cualquier ruta desconocida carga la app y termina acá.
function NotFound() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">Página no encontrada</h1>
      <EmptyState
        title="No encontramos esta página"
        description="Puede que la dirección esté mal escrita o que la página ya no exista."
        action={
          <Link to="/" className={PRIMARY_LINK_CLASSES}>
            Ir al inicio
          </Link>
        }
      />
    </section>
  );
}

export default NotFound;
