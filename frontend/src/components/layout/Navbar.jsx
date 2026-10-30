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
import SearchBar from '../product/SearchBar';
import Logo from './Logo';

const NAV_ITEM_CLASSES =
  'focus-ring inline-flex h-12 items-center gap-2 rounded-control font-medium text-white hover:underline';

const navLinkClasses = ({ isActive }) =>
  `${NAV_ITEM_CLASSES} ${isActive ? 'underline underline-offset-4' : ''}`;

function Navbar() {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentSearch =
    location.pathname === '/products' ? (searchParams.get('search') ?? '') : '';

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (term) => {
    closeMenu();
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
    accountArea = (
      <>
        <span className="inline-flex h-12 items-center font-medium text-white">
          Hola, {user.name}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className={NAV_ITEM_CLASSES}
        >
          <LogOut aria-hidden="true" className="h-5 w-5" />
          Cerrar sesión
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
      <div className="page-container flex flex-wrap items-center gap-3 py-3 lg:flex-nowrap lg:gap-6 lg:py-4">
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
          className={`${menuOpen ? 'flex' : 'hidden'} order-4 w-full flex-col border-t border-control-border pt-2 lg:order-none lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6 lg:border-0 lg:pt-0`}
        >
          <NavLink
            to="/products"
            onClick={closeMenu}
            className={navLinkClasses}
          >
            Catálogo
          </NavLink>
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
          className="focus-ring order-2 ml-auto inline-flex h-12 items-center gap-2 rounded-control bg-accent px-4 font-semibold text-ink hover:underline lg:order-none lg:ml-0"
        >
          <ShoppingCart aria-hidden="true" className="h-5 w-5" />
          Carrito
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
