import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Equipment } from '../types';
import { EquipmentFilters, type FilterState } from '../components/equipment/EquipmentFilters';
import { EquipmentCard } from '../components/equipment/EquipmentCard';
import { EquipmentDetailModal } from '../components/equipment/EquipmentDetailModal';
import { BookingModal } from '../components/equipment/BookingModal';
import { EmptyState } from '../components/ui/EmptyState';

export const ExplorePage: React.FC = () => {
  const { equipment, globalSearch } = useApp();

  const [filters, setFilters] = useState<FilterState>({
    search: globalSearch || '',
    department: 'All',
    category: 'All',
    status: 'All',
    sortBy: 'popularity',
  });

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  React.useEffect(() => {
    if (globalSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: globalSearch }));
    }
  }, [globalSearch]);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: 'All',
      category: 'All',
      status: 'All',
      sortBy: 'popularity',
    });
  };

  const filteredEquipment = useMemo(() => {
    return equipment
      .filter((item) => {
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase().trim();
          const matches =
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.location.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.department.toLowerCase().includes(q);
          if (!matches) return false;
        }

        if (filters.department !== 'All' && item.department !== filters.department) {
          return false;
        }

        if (filters.category !== 'All' && item.category !== filters.category) {
          return false;
        }

        if (filters.status !== 'All' && item.status !== filters.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'popularity':
            return b.bookingCount - a.bookingCount;
          case 'availability':
            if (a.status === 'available' && b.status !== 'available') return -1;
            if (a.status !== 'available' && b.status === 'available') return 1;
            return b.bookingCount - a.bookingCount;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [equipment, filters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="space-y-6"
    >
      {/* Success Notification Alert */}
      {successToast && (
        <div className="p-3.5 bg-[#0e1d15] border border-[#1b3b29] rounded-[2px] flex items-center justify-between text-xs text-[#4ade80]">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#4ade80]" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-[#8e8e8c] hover:text-[#faf8f9] font-mono ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-medium text-[#faf8f9] tracking-tight">
            Equipment Discovery
          </h2>
          <p className="text-xs text-[#8e8e8c] mt-0.5">
            Cross-department laboratory resource registry with real-time status and specifications
          </p>
        </div>
      </div>

      {/* Filter Component */}
      <EquipmentFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalCount={equipment.length}
        filteredCount={filteredEquipment.length}
      />

      {/* Equipment Grid */}
      {filteredEquipment.length === 0 ? (
        <EmptyState
          icon={<Cpu className="w-6 h-6" />}
          title="No laboratory equipment matched"
          description="Adjust your search terms or reset the department and category filters."
          action={
            <button
              onClick={handleResetFilters}
              className="text-xs px-3.5 py-2 bg-[#ece8df] text-[#040404] hover:bg-[#f5f2ea] rounded-[2px] cursor-pointer"
            >
              Clear All Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEquipment.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onSelect={(eq) => setSelectedEquipment(eq)}
              onBook={(eq) => setBookingEquipment(eq)}
            />
          ))}
        </div>
      )}

      {/* Detailed Specs Modal */}
      <EquipmentDetailModal
        equipment={selectedEquipment}
        isOpen={Boolean(selectedEquipment)}
        onClose={() => setSelectedEquipment(null)}
        onBook={(eq) => {
          setSelectedEquipment(null);
          setBookingEquipment(eq);
        }}
      />

      {/* Booking Form Modal */}
      <BookingModal
        equipment={bookingEquipment}
        isOpen={Boolean(bookingEquipment)}
        onClose={() => setBookingEquipment(null)}
        onSuccess={(_bookingId) => {
          setSuccessToast(
            `Reservation submitted for ${bookingEquipment?.name}! Review it anytime under My Bookings.`
          );
          setTimeout(() => setSuccessToast(null), 6000);
        }}
      />
    </motion.div>
  );
};

export default ExplorePage;
