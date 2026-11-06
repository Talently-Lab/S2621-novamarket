import { Link } from 'react-router-dom';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="page-container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <p>Tecnología y electrónica</p>
        </div>
        <Link
          to="/products"
          className="focus-ring inline-flex h-12 items-center justify-center self-start rounded-control bg-white px-6 font-semibold text-ink hover:bg-canvas md:self-auto"
        >
          Volver al catálogo
        </Link>
      </div>
      <div className="page-container border-t border-control-border py-4">
        <p className="text-sm">© 2026 NovaMarket</p>
      </div>
    </footer>
  );
}

export default Footer;
