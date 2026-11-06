import { PackageSearch } from 'lucide-react';

function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-white px-6 py-12 text-center">
      <PackageSearch aria-hidden="true" className="h-10 w-10 text-muted" />
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      {description && <p className="max-w-md text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;
