import { LoaderCircle } from 'lucide-react';

const SIZE_CLASSES = {
  sm: { wrapper: 'gap-2 text-sm', icon: 'h-4 w-4' },
  md: { wrapper: 'gap-3 py-8', icon: 'h-6 w-6' },
};

function Loader({ label = 'Cargando...', size = 'md' }) {
  const classes = SIZE_CLASSES[size];

  return (
    <div
      role="status"
      className={`flex items-center justify-center text-muted ${classes.wrapper}`}
    >
      <LoaderCircle
        aria-hidden="true"
        className={`text-primary motion-safe:animate-spin ${classes.icon}`}
      />
      <span>{label}</span>
    </div>
  );
}

export default Loader;
