import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="focus-ring sr-only rounded-control bg-white px-4 py-3 font-semibold text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <div className="page-container py-8 md:py-12">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
