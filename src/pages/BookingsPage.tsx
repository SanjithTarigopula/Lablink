import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, CalendarPlus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookingCard } from '../components/booking/BookingCard';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import { BookingModal } from '../components/equipment/BookingModal';
import type { Booking, Equipment } from '../types';

export const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, equipment, currentRole, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [rebookingEquipment, setRebookingEquipment] = useState<Equipment | null>(null);

  const userBookings = useMemo(() => {
    if (currentRole === 'student') {
      const myBookings = bookings.filter((b) => b.studentId === currentUser.id);
      return myBookings.length > 0 ? myBookings : bookings;
    }
    return bookings;
  }, [bookings, currentRole, currentUser]);

  const counts = {
    all: userBookings.length,
    pending: userBookings.filter((b) => b.status === 'pending').length,
    approved: userBookings.filter((b) => b.status === 'approved').length,
    confirmed: userBookings.filter((b) => b.status === 'confirmed').length,
    completed: userBookings.filter((b) => b.status === 'completed').length,
    rejected: userBookings.filter((b) => b.status === 'rejected').length,
    cancelled: userBookings.filter((b) => b.status === 'cancelled').length,
  };

  const tabs = [
    { label: 'All', value: 'all', count: counts.all },
    { label: 'Pending', value: 'pending', count: counts.pending },
    { label: 'Approved', value: 'approved', count: counts.approved },
    { label: 'Confirmed', value: 'confirmed', count: counts.confirmed },
    { label: 'Completed', value: 'completed', count: counts.completed },
    { label: 'Rejected', value: 'rejected', count: counts.rejected },
    { label: 'Cancelled', value: 'cancelled', count: counts.cancelled },
  ];

  const filteredBookings = useMemo(() => {
    return userBookings.filter((b) => {
      if (activeTab !== 'all' && b.status !== activeTab) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return (
          b.equipmentName.toLowerCase().includes(q) ||
          b.purpose.toLowerCase().includes(q) ||
          b.studentName.toLowerCase().includes(q) ||
          b.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [userBookings, activeTab, search]);

  const handleRebook = (bkg: Booking) => {
    const eq = equipment.find((e) => e.id === bkg.equipmentId);
    if (eq) {
      setRebookingEquipment(eq);
    } else {
      navigate('/explore');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-[#faf8f9] tracking-tight">
            {currentRole === 'student' ? 'My Laboratory Bookings' : 'Reservation Registry'}
          </h2>
          <p className="text-xs text-[#8e8e8c] mt-0.5">
            Monitor reservation approvals, time allocations and test bench occupancy
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#ece8df] hover:bg-[#f5f2ea] text-[#040404] rounded-[2px] text-xs font-medium cursor-pointer transition-colors"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="bg-[#121311] rounded-[2px] border border-[#232321] p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="border-0" />

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#676865] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter bookings..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] text-[#faf8f9] placeholder-[#676865] focus:bg-[#121311] focus:outline-none focus:border-[#f0c45a]"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-6 h-6" />}
          title={`No ${activeTab !== 'all' ? activeTab : ''} bookings found`}
          description={
            search
              ? 'No reservations matched your search query.'
              : 'You have no scheduled bookings in this status category.'
          }
          action={
            <button
              onClick={() => navigate('/explore')}
              className="text-xs px-3.5 py-2 bg-[#ece8df] text-[#040404] hover:bg-[#f5f2ea] rounded-[2px] cursor-pointer"
            >
              Browse Available Equipment
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onRebook={handleRebook} />
          ))}
        </div>
      )}

      {/* Rebook Modal */}
      <BookingModal
        equipment={rebookingEquipment}
        isOpen={Boolean(rebookingEquipment)}
        onClose={() => setRebookingEquipment(null)}
        onSuccess={() => setRebookingEquipment(null)}
      />
    </motion.div>
  );
};

export default BookingsPage;
