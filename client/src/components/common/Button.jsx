import { ArrowRight } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  icon = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const base =
    'inline-flex items-center gap-2 px-6 py-3 rounded-md font-body font-medium text-sm transition-all duration-200';

  const variants = {
    primary: 'bg-signal text-ink hover:bg-amber-400 hover:-translate-y-0.5',
    secondary:
      'bg-transparent border border-inkMuted/40 text-ink50 hover:border-pulse hover:text-pulse',
    ghost: 'bg-transparent text-ink50 hover:text-signal',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      {icon && <ArrowRight size={16} />}
    </button>
  );
}