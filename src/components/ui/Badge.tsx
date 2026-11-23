import React from 'react';

export type BadgeVariant =
  | 'available'
  | 'in-use'
  | 'maintenance'
  | 'reserved'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'primary'
  | 'gold'
  | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant | string;
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  available: {
    bg: 'bg-[#0e1d15]',
    text: 'text-[#4ade80]',
    border: 'border-[#1b3b29]',
    dot: 'bg-[#22c55e]',
  },
  approved: {
    bg: 'bg-[#0e1d15]',
    text: 'text-[#4ade80]',
    border: 'border-[#1b3b29]',
    dot: 'bg-[#22c55e]',
  },
  confirmed: {
    bg: 'bg-[#121a24]',
    text: 'text-[#93c5fd]',
    border: 'border-[#1e2e42]',
    dot: 'bg-[#60a5fa]',
  },
  completed: {
    bg: 'bg-[#181916]',
    text: 'text-[#e5e5e4]',
    border: 'border-[#282924]',
    dot: 'bg-[#8e8e8c]',
  },
  'in-use': {
    bg: 'bg-[#221b0c]',
    text: 'text-[#f0c45a]',
    border: 'border-[#3d3015]',
    dot: 'bg-[#f0c45a]',
  },
  pending: {
    bg: 'bg-[#221b0c]',
    text: 'text-[#f0c45a]',
    border: 'border-[#3d3015]',
    dot: 'bg-[#f0c45a]',
  },
  maintenance: {
    bg: 'bg-[#241113]',
    text: 'text-[#f87171]',
    border: 'border-[#441a1d]',
    dot: 'bg-[#ef4444]',
  },
  rejected: {
    bg: 'bg-[#241113]',
    text: 'text-[#f87171]',
    border: 'border-[#441a1d]',
    dot: 'bg-[#ef4444]',
  },
  cancelled: {
    bg: 'bg-[#181916]',
    text: 'text-[#8e8e8c]',
    border: 'border-[#282924]',
    dot: 'bg-[#676865]',
  },
  reserved: {
    bg: 'bg-[#121a24]',
    text: 'text-[#93c5fd]',
    border: 'border-[#1e2e42]',
    dot: 'bg-[#60a5fa]',
  },
  primary: {
    bg: 'bg-[#221b0c]',
    text: 'text-[#f0c45a]',
    border: 'border-[#3d3015]',
    dot: 'bg-[#f0c45a]',
  },
  gold: {
    bg: 'bg-[#221b0c]',
    text: 'text-[#f0c45a]',
    border: 'border-[#3d3015]',
    dot: 'bg-[#f0c45a]',
  },
  neutral: {
    bg: 'bg-[#181916]',
    text: 'text-[#8e8e8c]',
    border: 'border-[#232321]',
    dot: 'bg-[#676865]',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = true,
  children,
  className = '',
}) => {
  const normalizedKey = variant.toLowerCase();
  const styles = variantStyles[normalizedKey] || variantStyles.neutral;

  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1.5' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-normal rounded-[2px] border ${styles.bg} ${styles.text} ${styles.border} ${sizeClass} tracking-tight ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-[1px] shrink-0 ${styles.dot}`} />}
      <span className="capitalize">{children}</span>
    </span>
  );
};

export default Badge;
