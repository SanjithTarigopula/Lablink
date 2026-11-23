import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-[#232321] rounded-[2px] bg-[#0e0f0d]/60 ${className}`}
    >
      {icon && (
        <div className="w-10 h-10 rounded-[2px] bg-[#181916] flex items-center justify-center text-[#8e8e8c] border border-[#232321] mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-medium text-[#faf8f9] tracking-tight">{title}</h3>
      <p className="text-xs text-[#8e8e8c] max-w-sm mt-1 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
