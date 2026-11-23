import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle2,
  RotateCcw,
  Building2,
  XCircle,
} from 'lucide-react';
import type { Booking } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatDate, formatTime } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

export interface BookingCardProps {
  booking: Booking;
  onRebook?: (booking: Booking) => void;
}

/**
 * Returns true when the booking's scheduled end time is in the past
 * relative to the current time.
 */
function isBookingPast(booking: Booking): boolean {
  const endDateTime = new Date(`${booking.date}T${booking.endTime}:00`);
  return endDateTime.getTime() <= Date.now();
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onRebook }) => {
  const { updateBooking, currentRole } = useApp();

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleCancelBooking = () => {
    updateBooking(booking.id, { status: 'cancelled' });
    setIsCancelOpen(false);
  };

  const handleConfirmReservation = () => {
    updateBooking(booking.id, { status: 'confirmed' });
    setIsConfirmOpen(false);
  };

  const handleCompleteSession = () => {
    // Only allow completion if the booking end time has passed
    if (!isBookingPast(booking)) {
      return; // Guard: cannot complete a future booking
    }
    updateBooking(booking.id, { status: 'completed' });
  };

  const past = isBookingPast(booking);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#121311] rounded-[2px] border border-[#232321] p-5 hover:border-[#353632] transition-colors flex flex-col justify-between"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded-[1px] bg-[#181916] text-[#8e8e8c] border border-[#232321]">
                  {booking.department}
                </span>
                <span className="text-[11px] font-mono text-[#676865]">#{booking.id}</span>
              </div>
              <h3 className="text-sm font-medium text-[#faf8f9] leading-tight">
                {booking.equipmentName}
              </h3>
            </div>

            <Badge variant={booking.status} size="sm">
              {booking.status}
            </Badge>
          </div>

          {/* Time & Date schedule badge */}
          <div className="p-3 rounded-[2px] bg-[#0e0f0d] border border-[#232321] grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#faf8f9]">
              <Calendar className="w-3.5 h-3.5 text-[#f0c45a] shrink-0" />
              <span className="font-mono text-[11px]">{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-[#faf8f9]">
              <Clock className="w-3.5 h-3.5 text-[#ece8df] shrink-0" />
              <span className="font-mono text-[11px]">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </span>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8e8e8c] block mb-1">
              Stated Research Purpose
            </span>
            <p className="text-xs text-[#e5e5e4] leading-relaxed bg-[#0e0f0d] p-2.5 rounded-[2px] border border-[#232321]">
              {booking.purpose}
            </p>
          </div>

          {/* Project or Student association */}
          <div className="flex items-center justify-between text-[11px] text-[#8e8e8c] pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-[#676865]" />
              <span>Applicant: <strong className="text-[#faf8f9] font-normal">{booking.studentName}</strong></span>
            </div>

            {booking.projectId && (
              <span className="text-[#f0c45a] font-mono text-[10px] bg-[#221b0c] border border-[#3d3015] px-1.5 py-0.2 rounded-[1px]">
                Project Linked
              </span>
            )}
          </div>
        </div>

        {/* Action Controls based on current status */}
        <div className="pt-4 mt-4 border-t border-[#232321] flex items-center justify-end gap-2">
          {booking.status === 'pending' && (
            <>
              <Button
                variant="danger"
                size="sm"
                className="text-xs"
                onClick={() => setIsCancelOpen(true)}
              >
                Withdraw Request
              </Button>
              {(currentRole === 'faculty' || currentRole === 'admin') && (
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsConfirmOpen(true)}
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Approve Slot
                </Button>
              )}
            </>
          )}

          {booking.status === 'approved' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={() => setIsCancelOpen(true)}
              >
                Cancel Slot
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="text-xs"
                onClick={() => setIsConfirmOpen(true)}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Confirm Attendance
              </Button>
            </>
          )}

          {booking.status === 'confirmed' && (
            <Button
              variant="secondary"
              size="sm"
              className={`text-xs ${
                past
                  ? 'text-[#4ade80] border-[#1b3b29] bg-[#0e1d15] hover:bg-[#152a1e]'
                  : 'text-[#676865] border-[#232321] bg-[#181916] cursor-not-allowed'
              }`}
              onClick={handleCompleteSession}
              disabled={!past}
              icon={<CheckCircle2 className={`w-3.5 h-3.5 ${past ? 'text-[#4ade80]' : 'text-[#676865]'}`} />}
            >
              {past ? 'Mark Session Complete' : 'Session Not Yet Started'}
            </Button>
          )}

          {booking.status === 'rejected' && onRebook && (
            <Button
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={() => onRebook(booking)}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Re-schedule Alternate Slot
            </Button>
          )}

          {booking.status === 'cancelled' && onRebook && (
            <Button
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={() => onRebook(booking)}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Re-schedule Alternate Slot
            </Button>
          )}

          {booking.status === 'completed' && (
            <span className="text-[11px] font-mono text-[#8e8e8c] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />
              Session Concluded & Verified
            </span>
          )}

          {booking.status === 'rejected' && !onRebook && (
            <span className="text-[11px] font-mono text-[#8e8e8c] flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-[#f87171]" />
              Rejected by Faculty
            </span>
          )}

          {booking.status === 'cancelled' && !onRebook && (
            <span className="text-[11px] font-mono text-[#8e8e8c] flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-[#676865]" />
              Cancelled by Applicant
            </span>
          )}
        </div>
      </motion.div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancelBooking}
        title="Cancel Equipment Reservation"
        message={`Are you sure you want to cancel the reservation for ${booking.equipmentName} on ${booking.date}? This slot will be instantly released for other students.`}
        confirmLabel="Confirm Cancellation"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmReservation}
        title="Confirm Lab Reservation"
        message={`Confirming reservation for ${booking.equipmentName} on ${booking.date} (${booking.startTime} - ${booking.endTime}). Laboratory lock codes will be dispatched to your account.`}
        confirmLabel="Confirm Slot"
        variant="primary"
      />
    </>
  );
};

export default BookingCard;
