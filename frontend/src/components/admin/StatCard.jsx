function StatCard({ label, value, hint, Icon, tone = 'default' }) {
  const iconClasses =
    tone === 'warning' ? 'bg-accent text-ink' : 'bg-soft text-primary';

  return (
    <div className="flex items-start gap-4 rounded-card border border-border bg-white p-5">
      {Icon && (
        <span
          aria-hidden="true"
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control ${iconClasses}`}
        >
          <Icon className="h-6 w-6" />
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="break-words text-2xl font-bold text-ink">{value}</p>
        {hint && <p className="text-sm text-muted">{hint}</p>}
      </div>
    </div>
  );
}

export default StatCard;
