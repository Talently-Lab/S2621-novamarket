import { useState } from 'react';
import {
  Link,
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { LogOut, Menu, ShoppingCart, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import SearchBar from '../product/SearchBar';
import CategoryMenu from './CategoryMenu';
import Logo from './Logo';

const NAV_ITEM_CLASSES =
  'focus-ring inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-control font-medium text-white hover:underline';

const navLinkClasses = ({ isActive }) =>
  `${NAV_ITEM_CLASSES} ${isActive ? 'underline underline-offset-4' : ''}`;

function Navbar() {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentSearch =
    location.pathname === '/products' ? (searchParams.get('search') ?? '') : '';

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (term) => {
    closeMenu();

    if (location.pathname === '/products') {
      // En el catálogo la búsqueda se suma a la categoría elegida y vuelve a la página 1.
      const next = new URLSearchParams(searchParams);

      if (term) {
        next.set('search', term);
      } else {
        next.delete('search');
      }
      next.delete('page');

      const query = next.toString();
      navigate({ pathname: '/products', search: query ? `?${query}` : '' });
      return;
    }

    navigate(
      term
        ? {
            pathname: '/products',
            search: `?${createSearchParams({ search: term })}`,
          }
        : '/products',
    );
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  let accountArea;

  if (loading) {
    // Mientras se revalida la sesión se reserva el lugar, sin mostrar "Ingresar" de más.
    accountArea = <span aria-hidden="true" className="h-12 lg:w-24" />;
  } else if (isAuthenticated) {
    // En desktop angosto (1024 a 1439 px) la barra no entra completa: el saludo se oculta hasta 1280 y
    // "Cerrar sesión" queda solo con el ícono. Los textos siguen disponibles para lectores de pantalla.
    const firstName = user.name?.trim().split(/\s+/)[0] ?? '';

    accountArea = (
      <>
        <span
          title={user.name}
          className="inline-flex h-12 min-w-0 items-center whitespace-nowrap font-medium text-white lg:max-xl:sr-only"
        >
          Hola,&nbsp;<span className="max-w-[10rem] truncate">{firstName}</span>
        </span>
        <button
          type="button"
          onClick={handleLogout}
          title="Cerrar sesión"
          className={`${NAV_ITEM_CLASSES} lg:max-[1439px]:w-12 lg:max-[1439px]:justify-center`}
        >
          <LogOut aria-hidden="true" className="h-5 w-5" />
          <span className="lg:max-[1439px]:sr-only">Cerrar sesión</span>
        </button>
      </>
    );
  } else {
    accountArea = (
      <NavLink to="/login" onClick={closeMenu} className={navLinkClasses}>
        Ingresar
      </NavLink>
    );
  }

  // El orden del DOM es el de desktop; en mobile las clases order-* arman las dos filas.
  return (
    <header className="bg-ink">
      <div className="page-container flex flex-wrap items-center gap-3 py-3 lg:flex-nowrap lg:gap-4 lg:py-4 xl:gap-6">
        <div className="order-1 lg:order-none">
          <Logo onClick={closeMenu} />
        </div>

        <div className="order-3 flex w-full items-center gap-3 lg:order-none lg:w-auto lg:flex-1">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="navbar-menu"
            className="focus-ring inline-flex h-12 shrink-0 items-center gap-2 rounded-control border border-control-border px-4 font-medium text-white lg:hidden"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
            Menú
          </button>
          <div className="min-w-0 flex-1 lg:max-w-xl">
            <SearchBar
              key={currentSearch}
              value={currentSearch}
              onSearch={handleSearch}
            />
          </div>
        </div>

        <nav
          id="navbar-menu"
          aria-label="Principal"
          className={`${menuOpen ? 'flex' : 'hidden'} order-4 w-full flex-col border-t border-control-border pt-2 lg:order-none lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-4 lg:border-0 lg:pt-0 xl:gap-6`}
        >
          <NavLink
            to="/products"
            onClick={closeMenu}
            className={navLinkClasses}
          >
            Catálogo
          </NavLink>
          <CategoryMenu onNavigate={closeMenu} />
          {isAdmin && (
            <NavLink to="/admin" onClick={closeMenu} className={navLinkClasses}>
              Admin
            </NavLink>
          )}
          {accountArea}
        </nav>

        <Link
          to="/cart"
          onClick={closeMenu}
          className="focus-ring order-2 ml-auto inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-control bg-accent px-4 font-semibold text-ink hover:underline lg:order-none lg:ml-0"
        >
          <ShoppingCart aria-hidden="true" className="h-5 w-5" />
          Carrito
          {totalItems > 0 && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-2 text-sm font-bold text-white">
              {totalItems}
              <span className="sr-only">
                {totalItems === 1 ? ' producto' : ' productos'}
              </span>
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
