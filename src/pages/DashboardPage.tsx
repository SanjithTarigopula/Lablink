import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LabLinkIcon } from '../components/brand/LabLinkIcon';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { BookingActivityChart } from '../components/dashboard/BookingActivityChart';
import { EquipmentAvailabilityChart } from '../components/dashboard/EquipmentAvailabilityChart';
import { RecentBookings } from '../components/dashboard/RecentBookings';
import { PendingRequests } from '../components/dashboard/PendingRequests';
import { PopularEquipment } from '../components/dashboard/PopularEquipment';
import { QuickActions } from '../components/dashboard/QuickActions';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { conflicts } = useApp();

  const unresolvedConflicts = conflicts.filter((c) => !c.resolved).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="space-y-6"
    >
      {/* Top Banner / Status Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121311] border border-[#232321] rounded-[2px] p-6 text-[#faf8f9] relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#181916] border border-[#232321] text-[#f0c45a] text-[11px] font-mono mb-2.5">
            <LabLinkIcon size={14} className="text-[#f0c45a]" />
            <span>Campus Lab Grid — Unified Research Infrastructure</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#faf8f9]">
            {getGreeting()}
          </h2>
          <p className="text-xs sm:text-sm text-[#8e8e8c] max-w-2xl mt-1 leading-relaxed">
            Centralized equipment discovery, cross-departmental laboratory access, and deterministic contention arbitration across 6 engineering disciplines.
          </p>
        </div>

        {unresolvedConflicts > 0 && (
          <div className="relative z-10 shrink-0">
            <Link
              to="/allocation"
              className="inline-flex items-center gap-2 bg-[#ece8df] text-[#040404] hover:bg-[#f5f2ea] px-3.5 py-2 rounded-[2px] text-xs font-medium transition-colors group"
            >
              <span className="font-mono text-[#f0c45a] bg-[#181916] px-1.5 py-0.2 rounded-[1px] text-[10px]">
                {unresolvedConflicts}
              </span>
              <span>Scheduling Contention</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      {/* Quick Action Bar */}
      <QuickActions />

      {/* KPI Stats Grid */}
      <StatsGrid />

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BookingActivityChart />
        </div>
        <div className="lg:col-span-5">
          <EquipmentAvailabilityChart />
        </div>
      </div>

      {/* Activity & Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <RecentBookings />
          <PopularEquipment />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <PendingRequests />

          {/* Department Coverage Card */}
          <div className="bg-[#121311] rounded-[2px] border border-[#232321] p-5">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#8e8e8c] mb-3">
              Connected Department Laboratories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'CSE', desc: 'AI & HPC Computing', tag: 'Lab A-102' },
                { name: 'ECE', desc: 'RF & Embedded Systems', tag: 'Lab B-204' },
                { name: 'EEE', desc: 'Power & Microgrids', tag: 'Lab C-110' },
                { name: 'Mechanical', desc: 'Fabrication & Robotics', tag: 'FabLab 01' },
                { name: 'Civil', desc: 'Structures & Survey', tag: 'Testing Bay' },
                { name: 'Biotechnology', desc: 'Genomics & PCR', tag: 'BioCore Lab' },
              ].map((dept) => (
                <div
                  key={dept.name}
                  className="p-2.5 rounded-[2px] border border-[#232321] bg-[#0e0f0d] text-left hover:border-[#353632] transition-colors"
                >
                  <div className="text-xs font-medium text-[#faf8f9]">{dept.name}</div>
                  <div className="text-[10px] text-[#8e8e8c] truncate">{dept.desc}</div>
                  <div className="text-[9px] text-[#676865] font-mono mt-1">{dept.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
