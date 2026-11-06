const VARIANT_CLASSES = {
  offer: 'bg-accent text-ink',
  featured: 'bg-primary text-white',
  status: 'bg-ink text-white',
};

function Badge({ children, variant = 'status' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
