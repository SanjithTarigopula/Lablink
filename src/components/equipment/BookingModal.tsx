import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';
import type { Equipment } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export interface BookingModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

// Available standard lab time slots
const TIME_SLOTS = [
  { start: '09:00', end: '11:00', label: '09:00 AM - 11:00 AM (Morning Session 1)' },
  { start: '11:00', end: '13:00', label: '11:00 AM - 01:00 PM (Morning Session 2)' },
  { start: '13:00', end: '14:00', label: '01:00 PM - 02:00 PM (Lunch Maintenance)', disabledByDefault: true },
  { start: '14:00', end: '16:00', label: '02:00 PM - 04:00 PM (Afternoon Session 1)' },
  { start: '16:00', end: '18:00', label: '04:00 PM - 06:00 PM (Afternoon Session 2)' },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, currentRole, projects, bookings, addBooking } = useApp();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(tomorrowStr);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [projectId, setProjectId] = useState<string>('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!equipment) return null;

  // Filter projects owned by student (or all if faculty/admin demo)
  const availableProjects = projects.filter(
    (p) => currentRole !== 'student' || p.studentId === currentUser.id
  );

  // Check which slots are already booked on the selected date for this equipment
  const getSlotAvailability = (start: string, end: string) => {
    return bookings.some((b) => {
      if (b.equipmentId !== equipment.id || b.date !== date) return false;
      if (b.status === 'rejected') return false;
      return b.startTime < end && b.endTime > start;
    });
  };

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    if (!date) {
      setError('Please select a reservation date.');
      return;
    }
    if (!selectedSlot) {
      setError('Please select an available time window.');
      return;
    }
    if (purpose.trim().length < 10) {
      setError('Please provide a specific purpose for this booking (min 10 characters).');
      return;
    }

    setIsSubmitting(true);

    const result = addBooking({
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      studentId: currentUser.id,
      studentName: currentUser.name,
      date,
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
      status: 'pending',
      purpose: purpose.trim(),
      projectId: projectId || undefined,
      department: equipment.department,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Success! Reset form & close
    setPurpose('');
    onClose();
    if (result.booking) {
      onSuccess(result.booking.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-4.5 h-4.5 text-[#f0c45a]" />
          <span>Book Laboratory Equipment</span>
        </div>
      }
      subtitle={`Reserving: ${equipment.name} (${equipment.department} Department)`}
      footer={
        <div className="w-full flex items-center justify-between">
          <div className="text-xs text-[#8e8e8c]">
            Booking as <span className="text-[#faf8f9] font-medium">{currentUser.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              loading={isSubmitting}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Reservation
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#241113] border border-[#441a1d] rounded-[2px] flex items-start gap-2.5 text-xs text-[#f87171]">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#f87171] mt-0.5" />
            <div>
              <p className="font-medium text-[#faf8f9]">Booking Request Disallowed</p>
              <p className="mt-0.5 text-[#8e8e8c]">{error}</p>
            </div>
          </div>
        )}

        {/* Date Selection */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1.5">
            Reservation Date <span className="text-[#f87171]">*</span>
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setDate(e.target.value);
              setError(null);
            }}
            className="w-full text-xs sm:text-sm bg-[#0e0f0d] border border-[#232321] rounded-[2px] p-2.5 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a] font-mono"
            required
          />
        </div>

        {/* Available Time Slots */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1.5 flex items-center justify-between">
            <span>Select Time Window</span>
            <span className="text-[10px] font-mono text-[#676865]">Standard 2-hour lab slots</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isSlotBooked = getSlotAvailability(slot.start, slot.end);
              const isDisabled = slot.disabledByDefault || isSlotBooked;
              const isSelected = selectedSlot.start === slot.start && !isDisabled;

              return (
                <div
                  key={slot.start}
                  onClick={() => {
                    if (!isDisabled) {
                      setSelectedSlot(slot);
                      setError(null);
                    }
                  }}
                  className={`
                    p-3 rounded-[2px] border flex items-center justify-between text-xs transition-colors cursor-pointer
                    ${
                      isSelected
                        ? 'border-[#f0c45a] bg-[#221b0c] text-[#faf8f9] font-medium'
                        : isDisabled
                        ? 'border-[#232321] bg-[#151613] text-[#676865] cursor-not-allowed opacity-70'
                        : 'border-[#232321] bg-[#0e0f0d] hover:border-[#353632] text-[#e5e5e4]'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock
                      className={`w-3.5 h-3.5 ${
                        isSelected
                          ? 'text-[#f0c45a]'
                          : isDisabled
                          ? 'text-[#676865]'
                          : 'text-[#8e8e8c]'
                      }`}
                    />
                    <span className="font-mono text-[11px]">{slot.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {slot.disabledByDefault ? (
                      <span className="text-[9px] font-mono uppercase bg-[#181916] text-[#676865] border border-[#232321] px-1.5 py-0.2 rounded-[1px]">
                        Sanitize
                      </span>
                    ) : isSlotBooked ? (
                      <span className="text-[9px] font-mono uppercase bg-[#241113] text-[#f87171] border border-[#441a1d] px-1.5 py-0.2 rounded-[1px]">
                        Booked
                      </span>
                    ) : isSelected ? (
                      <span className="text-[9px] font-mono uppercase bg-[#f0c45a] text-[#040404] font-medium px-1.5 py-0.2 rounded-[1px]">
                        Selected
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase text-[#4ade80] bg-[#0e1d15] border border-[#1b3b29] px-1.5 py-0.2 rounded-[1px]">
                        Open
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Association */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1.5 flex items-center justify-between">
            <span>Associate with Approved Project</span>
            <span className="text-[10px] text-[#676865]">Optional</span>
          </label>
          <div className="relative">
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full text-xs sm:text-sm bg-[#0e0f0d] border border-[#232321] rounded-[2px] px-3 py-2 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a]"
            >
              <option value="" className="bg-[#121311] text-[#8e8e8c]">Independent Lab Session / Coursework Experiment</option>
              {availableProjects.map((proj) => (
                <option key={proj.id} value={proj.id} className="bg-[#121311] text-[#faf8f9]">
                  {proj.title} (Deadline: {proj.deadline})
                </option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-[#676865] mt-1 font-mono">
            Linking a project increases smart priority scoring if scheduling contentions occur.
          </p>
        </div>

        {/* Purpose / Justification */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1.5">
            Purpose of Booking <span className="text-[#f87171]">*</span>
          </label>
          <textarea
            rows={3}
            value={purpose}
            onChange={(e) => {
              setPurpose(e.target.value);
              setError(null);
            }}
            placeholder="Describe experimental protocol, algorithms, or components being fabricated/tested..."
            className="w-full text-xs sm:text-sm bg-[#0e0f0d] border border-[#232321] rounded-[2px] p-3 text-[#faf8f9] placeholder-[#676865] focus:outline-none focus:border-[#f0c45a]"
            required
          />
        </div>

        {/* Double Booking Prevention Notice */}
        <div className="p-3 rounded-[2px] bg-[#181916] border border-[#232321] text-[11px] text-[#8e8e8c] flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" />
          <span>
            <strong className="text-[#faf8f9]">Conflict Guard Active:</strong> Double booking is strictly
            prevented. Confirmed slots guarantee dedicated instrument ownership during your time window.
          </span>
        </div>
      </form>
    </Modal>
  );
};

export default BookingModal;
