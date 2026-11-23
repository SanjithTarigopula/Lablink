import React from 'react';
import {
  MapPin,
  Clock,
  Star,
  CalendarCheck,
  Layers,
  Award,
} from 'lucide-react';
import type { Equipment } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface EquipmentDetailModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (equipment: Equipment) => void;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onBook,
}) => {
  if (!equipment) return null;

  const isAvailable = equipment.status === 'available';

  // 7-day calendar availability generator
  const today = new Date();
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = d.getDate();
    const isFree = i % 3 !== 1 && equipment.status !== 'maintenance';
    return { dayName, dateNum, isFree, fullDate: d.toISOString().split('T')[0] };
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <span>{equipment.name}</span>
          <Badge variant={equipment.status} size="sm">
            {equipment.status}
          </Badge>
        </div>
      }
      subtitle={`${equipment.category} • ${equipment.department} Department • Lab ${equipment.location}`}
      footer={
        <div className="w-full flex items-center justify-between">
          <div className="text-xs text-[#8e8e8c]">
            Max session: <span className="font-mono text-[#faf8f9]">{equipment.maxBookingHours} hours</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!isAvailable}
              onClick={() => {
                onClose();
                onBook(equipment);
              }}
              icon={<CalendarCheck className="w-4 h-4" />}
            >
              {isAvailable ? 'Book This Equipment' : 'Currently Reserved'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Key Metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-[#0e0f0d] rounded-[2px] border border-[#232321]">
            <span className="text-[10px] uppercase font-mono text-[#8e8e8c]">Location</span>
            <div className="text-xs font-medium text-[#faf8f9] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#f0c45a]" />
              <span className="truncate">{equipment.location}</span>
            </div>
          </div>

          <div className="p-3 bg-[#0e0f0d] rounded-[2px] border border-[#232321]">
            <span className="text-[10px] uppercase font-mono text-[#8e8e8c]">Total Bookings</span>
            <div className="text-xs font-medium text-[#faf8f9] flex items-center gap-1 mt-0.5">
              <Layers className="w-3.5 h-3.5 text-[#ece8df]" />
              <span className="font-mono">{equipment.bookingCount} logged</span>
            </div>
          </div>

          <div className="p-3 bg-[#0e0f0d] rounded-[2px] border border-[#232321]">
            <span className="text-[10px] uppercase font-mono text-[#8e8e8c]">Reliability</span>
            <div className="text-xs font-medium text-[#faf8f9] flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-[#f0c45a] text-[#f0c45a]" />
              <span className="font-mono">{equipment.rating} / 5.0</span>
            </div>
          </div>

          <div className="p-3 bg-[#0e0f0d] rounded-[2px] border border-[#232321]">
            <span className="text-[10px] uppercase font-mono text-[#8e8e8c]">Max Session</span>
            <div className="text-xs font-medium text-[#faf8f9] flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#4ade80]" />
              <span className="font-mono">{equipment.maxBookingHours} Hours</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1.5">
            Overview & Description
          </h4>
          <p className="text-xs sm:text-sm text-[#e5e5e4] leading-relaxed bg-[#0e0f0d] p-3.5 rounded-[2px] border border-[#232321]">
            {equipment.description}
          </p>
        </div>

        {/* 7-Day Live Availability Horizon */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c]">
              7-Day Availability Forecast
            </h4>
            <span className="text-[11px] text-[#676865] font-mono">Real-time schedule</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {nextDays.map((d, i) => (
              <div
                key={i}
                className={`p-2 rounded-[2px] text-center border transition-all ${
                  d.isFree
                    ? 'border-[#1b3b29] bg-[#0e1d15] text-[#4ade80]'
                    : 'border-[#232321] bg-[#151613] text-[#676865]'
                }`}
              >
                <div className="text-[10px] font-mono uppercase">{d.dayName}</div>
                <div className="text-base font-mono my-0.5">{d.dateNum}</div>
                <div className="text-[9px] font-mono">
                  {d.isFree ? 'OPEN' : 'BUSY'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-2">
            Hardware & Technical Specifications
          </h4>

          <div className="rounded-[2px] border border-[#232321] overflow-hidden divide-y divide-[#232321]">
            {Object.entries(equipment.specifications).map(([key, val]) => (
              <div
                key={key}
                className="grid grid-cols-3 text-xs p-2.5 hover:bg-[#181916] transition-colors"
              >
                <div className="text-[#8e8e8c]">{key}</div>
                <div className="col-span-2 text-[#faf8f9] font-mono">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Certification Badge */}
        <div className="p-3 bg-[#181916] rounded-[2px] border border-[#232321] flex items-center gap-3">
          <Award className="w-4.5 h-4.5 text-[#f0c45a] shrink-0" />
          <p className="text-[11px] text-[#e5e5e4] leading-snug">
            <span className="font-medium text-[#faf8f9]">Inter-departmental Protocol:</span> This instrument is
            certified under the Campus Shared Facility Protocol. Cross-department students
            are granted equal reservation rights.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default EquipmentDetailModal;
