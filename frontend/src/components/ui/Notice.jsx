import { CircleCheck, Info } from 'lucide-react';

const VARIANTS = {
  success: { Icon: CircleCheck, classes: 'border-success text-success' },
  info: { Icon: Info, classes: 'border-control-border text-ink' },
};

function Notice({ variant = 'info', children }) {
  const { Icon, classes } = VARIANTS[variant];

  return (
    <p
      role="status"
      className={`flex items-start gap-2 rounded-control border bg-white p-4 ${classes}`}
    >
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export default Notice;
