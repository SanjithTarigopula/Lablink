import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#ece8df] text-[#040404] hover:bg-[#f5f2ea] active:bg-[#dedad1] border border-transparent font-medium shadow-none focus-visible:ring-1 focus-visible:ring-[#ece8df]',
  gold:
    'bg-[#f0c45a] text-[#040404] hover:bg-[#f5cf6d] active:bg-[#e2b74f] border border-transparent font-medium shadow-none focus-visible:ring-1 focus-visible:ring-[#f0c45a]',
  secondary:
    'bg-[#181916] text-[#e5e5e4] hover:bg-[#22231f] active:bg-[#282924] border border-[#232321] hover:border-[#343530] focus-visible:ring-1 focus-visible:ring-[#8e8e8c]',
  outline:
    'bg-transparent text-[#e5e5e4] hover:bg-[#181916] active:bg-[#22231f] border border-[#232321] hover:border-[#343530] focus-visible:ring-1 focus-visible:ring-[#8e8e8c]',
  ghost:
    'bg-transparent text-[#8e8e8c] hover:text-[#faf8f9] hover:bg-[#181916] active:bg-[#22231f] border border-transparent focus-visible:ring-1 focus-visible:ring-[#8e8e8c]',
  danger:
    'bg-[#2c1314] text-[#fca5a5] hover:bg-[#3d181a] border border-[#5c1d24] focus-visible:ring-1 focus-visible:ring-[#f87171]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-2.5 py-1.5 rounded-[2px] gap-1.5 h-7.5',
  md: 'text-sm px-3.5 py-1.5 rounded-[2px] gap-2 h-9',
  lg: 'text-sm px-4 py-2 rounded-[2px] gap-2.5 h-10',
};

const iconSizes: Record<ButtonSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4.5 h-4.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      disabled = false,
      children,
      className = '',
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        whileTap={isDisabled ? undefined : { scale: 0.99 }}
        aria-busy={loading}
        aria-disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        className={`
          inline-flex items-center justify-center font-normal cursor-pointer tracking-tight
          transition-colors duration-150 select-none outline-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <Loader2 className={`animate-spin ${iconSizes[size]}`} aria-hidden="true" />
        ) : (
          icon && iconPosition === 'left' && (
            <span className={`inline-flex shrink-0 ${iconSizes[size]}`}>{icon}</span>
          )
        )}

        {children && <span>{children}</span>}

        {!loading && icon && iconPosition === 'right' && (
          <span className={`inline-flex shrink-0 ${iconSizes[size]}`}>{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
