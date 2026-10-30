import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

function Pagination({ page, totalPages, total, onPageChange }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
    >
      <p className="text-muted">
        Página {page} de {totalPages} · {total}{' '}
        {total === 1 ? 'producto' : 'productos'}
      </p>
      <div className="flex gap-3">
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          Anterior
        </Button>
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}

export default Pagination;
