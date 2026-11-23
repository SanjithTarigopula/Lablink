import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down';
    label?: string;
  };
  iconBg?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  iconBg = 'bg-[#181916] text-[#f0c45a] border border-[#282924]',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#121311] rounded-[2px] border border-[#232321] p-5 hover:border-[#353632] transition-colors ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-[#8e8e8c] uppercase tracking-wider">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-[2px] flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-semibold tracking-tight text-[#faf8f9]">{value}</div>

        {change && (
          <div
            className={`inline-flex items-center text-[11px] font-normal px-2 py-0.5 rounded-[2px] border ${
              change.trend === 'up'
                ? 'bg-[#0e1d15] text-[#4ade80] border-[#1b3b29]'
                : 'bg-[#241113] text-[#f87171] border-[#441a1d]'
            }`}
          >
            {change.trend === 'up' ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            <span>
              {change.value > 0 ? `+${change.value}%` : `${change.value}%`}
            </span>
          </div>
        )}
      </div>

      {change?.label && (
        <p className="text-[11px] text-[#676865] mt-1.5">{change.label}</p>
      )}
    </motion.div>
  );
};

export default StatCard;
