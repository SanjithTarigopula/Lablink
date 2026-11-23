import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { Department, EquipmentCategory, AvailabilityStatus } from '../../types';

export interface FilterState {
  search: string;
  department: string;
  category: string;
  status: string;
  sortBy: 'popularity' | 'availability' | 'name-asc' | 'name-desc';
}

export interface EquipmentFiltersProps {
  filters: FilterState;
  onChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

const departments: (Department | 'All')[] = [
  'All',
  'CSE',
  'ECE',
  'EEE',
  'Mechanical',
  'Civil',
  'Biotechnology',
];

const categories: (EquipmentCategory | 'All')[] = [
  'All',
  'Development Kit',
  'Test & Measurement',
  'Computing',
  '3D Printing',
  'FPGA & Digital',
  'Robotics',
  'Optics & Imaging',
  'Manufacturing',
];

const statuses: (AvailabilityStatus | 'All')[] = [
  'All',
  'available',
  'in-use',
  'reserved',
  'maintenance',
];

export const EquipmentFilters: React.FC<EquipmentFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="bg-[#121311] rounded-[2px] border border-[#232321] p-4 space-y-3.5">
      {/* Top Search & Reset Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#676865] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search equipment by name, model, chip, or laboratory location..."
            className="w-full pl-8 pr-4 py-2 text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] text-[#faf8f9] placeholder-[#676865] focus:bg-[#121311] focus:outline-none focus:ring-1 focus:ring-[#f0c45a] focus:border-[#f0c45a] transition-colors"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="text-xs text-[#8e8e8c]">
            Showing <span className="font-mono text-[#faf8f9]">{filteredCount}</span> of <span className="font-mono text-[#faf8f9]">{totalCount}</span> units
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] text-xs text-[#8e8e8c] hover:text-[#faf8f9] bg-[#181916] hover:bg-[#20211d] transition-colors cursor-pointer border border-[#232321]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Filter Select Dropdowns Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Department Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => onChange({ department: e.target.value })}
            className="w-full text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] px-2.5 py-1.5 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a]"
          >
            {departments.map((d) => (
              <option key={d} value={d} className="bg-[#121311] text-[#faf8f9]">
                {d === 'All' ? 'All Departments' : `${d} Department`}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="w-full text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] px-2.5 py-1.5 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a]"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#121311] text-[#faf8f9]">
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">
            Availability Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
            className="w-full text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] px-2.5 py-1.5 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a]"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-[#121311] text-[#faf8f9]">
                {s === 'All' ? 'All Statuses' : s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">
            Sort Fleet By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as any })}
            className="w-full text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] px-2.5 py-1.5 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a]"
          >
            <option value="popularity" className="bg-[#121311] text-[#faf8f9]">Most Popular First</option>
            <option value="availability" className="bg-[#121311] text-[#faf8f9]">Available First</option>
            <option value="name-asc" className="bg-[#121311] text-[#faf8f9]">Name (A → Z)</option>
            <option value="name-desc" className="bg-[#121311] text-[#faf8f9]">Name (Z → A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EquipmentFilters;
