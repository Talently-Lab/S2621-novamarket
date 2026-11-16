import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ReceiptText } from 'lucide-react';

const SECTIONS = [
  { to: '/admin', label: 'Resumen', Icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Productos', Icon: Package },
  { to: '/admin/orders', label: 'Pedidos', Icon: ReceiptText },
];

const linkClasses = ({ isActive }) =>
  `focus-ring inline-flex h-12 shrink-0 items-center gap-2 rounded-control px-4 font-medium transition-colors ${isActive ? 'bg-ink text-white' : 'text-ink hover:bg-canvas'}`;

// Layout de /admin: título del panel y navegación entre secciones. Se renderiza dentro del Layout del sitio.
function AdminLayout() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">
          Panel de administración
        </p>
        <nav
          aria-label="Administración"
          className="flex gap-2 overflow-x-auto rounded-card border border-border bg-white p-2"
        >
          {SECTIONS.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClasses}>
              <Icon aria-hidden="true" className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  );
}

export default AdminLayout;
