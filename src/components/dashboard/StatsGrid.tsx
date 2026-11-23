import React from 'react';
import { Package, CheckCircle2, Calendar, Clock, TrendingUp } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { useApp } from '../../context/AppContext';

export const StatsGrid: React.FC = () => {
  const { equipment, bookings, approvals } = useApp();

  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter((e) => e.status === 'available').length;
  const inUseCount = equipment.filter((e) => e.status === 'in-use').length;
  const reservedCount = equipment.filter((e) => e.status === 'reserved').length;
  const maintenanceCount = equipment.filter((e) => e.status === 'maintenance').length;
  const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'approved').length;
  const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;

  // Equipment utilization rate calculation: active duty cycle across total fleet
  const utilizationPercentage = Math.round(
    (((inUseCount + reservedCount) / totalEquipment) * 100)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      <StatCard
        label="Total Equipment"
        value={totalEquipment}
        icon={<Package className="w-4 h-4 text-[#faf8f9]" />}
        change={{ value: 100, trend: 'up', label: `${availableEquipment} avail • ${inUseCount + reservedCount} active • ${maintenanceCount} maint` }}
        iconBg="bg-[#181916] text-[#faf8f9] border border-[#232321]"
      />

      <StatCard
        label="Available Now"
        value={availableEquipment}
        icon={<CheckCircle2 className="w-4 h-4 text-[#4ade80]" />}
        iconBg="bg-[#0e1d15] text-[#4ade80] border border-[#1b3b29]"
      />

      <StatCard
        label="Active Bookings"
        value={activeBookings}
        icon={<Calendar className="w-4 h-4 text-[#93c5fd]" />}
        change={{ value: 8, trend: 'up', label: 'this week' }}
        iconBg="bg-[#121a24] text-[#93c5fd] border border-[#1e2e42]"
      />

      <StatCard
        label="Pending Approvals"
        value={pendingApprovals}
        icon={<Clock className="w-4 h-4 text-[#f0c45a]" />}
        change={pendingApprovals > 0 ? { value: pendingApprovals, trend: 'up', label: 'awaiting review' } : undefined}
        iconBg="bg-[#221b0c] text-[#f0c45a] border border-[#3d3015]"
      />

      <StatCard
        label="Grid Utilization"
        value={`${utilizationPercentage}%`}
        icon={<TrendingUp className="w-4 h-4 text-[#f0c45a]" />}
        change={{ value: 5.4, trend: 'up', label: 'campus-wide efficiency' }}
        iconBg="bg-[#221b0c] text-[#f0c45a] border border-[#3d3015]"
      />
    </div>
  );
};

export default StatsGrid;
