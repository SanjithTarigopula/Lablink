import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';

export const PopularEquipment: React.FC = () => {
  const { equipment } = useApp();

  const sorted = [...equipment].sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 5);
  const maxBookings = sorted[0]?.bookingCount || 100;

  return (
    <Card
      title="High-Demand Equipment"
      subtitle="Most sought-after laboratory resources across campus"
      action={
        <Link
          to="/explore"
          className="text-xs text-[#8e8e8c] hover:text-[#f0c45a] flex items-center gap-1 group transition-colors"
        >
          Explore catalog
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      }
    >
      <div className="space-y-4">
        {sorted.map((item, idx) => {
          const percentage = Math.round((item.bookingCount / maxBookings) * 100);

          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-4 text-[#676865] font-mono text-[11px]">0{idx + 1}</span>
                  <Link
                    to="/explore"
                    className="font-medium text-[#faf8f9] hover:text-[#f0c45a] truncate transition-colors"
                  >
                    {item.name}
                  </Link>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#181916] text-[#8e8e8c] border border-[#232321] rounded-[2px] font-mono shrink-0">
                    {item.department}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-[#f0c45a] font-mono text-[11px]">
                    <Star className="w-3 h-3 fill-[#f0c45a]" />
                    <span>{item.rating}</span>
                  </div>
                  <span className="font-mono text-[#e5e5e4] text-xs">
                    {item.bookingCount} bookings
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-[#181916] border border-[#232321] rounded-none overflow-hidden">
                <div
                  className="h-full bg-[#f0c45a] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PopularEquipment;
