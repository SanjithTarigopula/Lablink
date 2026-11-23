import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface CardHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  header?: CardHeaderProps;
  padding?: boolean;
  children: React.ReactNode;
  className?: string;
  headerBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  header,
  padding = true,
  children,
  className = '',
  headerBorder = true,
  ...props
}) => {
  const effectiveTitle = header?.title ?? title;
  const effectiveSubtitle = header?.subtitle ?? subtitle;
  const effectiveAction = header?.action ?? action;
  const hasHeader = Boolean(effectiveTitle || effectiveSubtitle || effectiveAction);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`bg-[#121311] rounded-[2px] border border-[#232321] transition-colors duration-150 hover:border-[#353632] ${className}`}
      {...props}
    >
      {hasHeader && (
        <div
          className={`px-5 py-3.5 flex items-center justify-between gap-4 ${
            headerBorder ? 'border-b border-[#232321]' : ''
          }`}
        >
          <div>
            {effectiveTitle && (
              <h3 className="text-sm font-medium text-[#faf8f9] tracking-tight">
                {effectiveTitle}
              </h3>
            )}
            {effectiveSubtitle && (
              <p className="text-xs text-[#8e8e8c] mt-0.5">{effectiveSubtitle}</p>
            )}
          </div>
          {effectiveAction && <div className="shrink-0">{effectiveAction}</div>}
        </div>
      )}
      <div className={padding ? 'p-5' : ''}>{children}</div>
    </motion.div>
  );
};

export default Card;
