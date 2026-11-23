import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  Clock,
  Cpu,
  Layers,
  Wrench,
  Eye,
  CalendarCheck,
  Bot,
  Binary,
} from 'lucide-react';
import type { Equipment } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface EquipmentCardProps {
  equipment: Equipment;
  onSelect: (equipment: Equipment) => void;
  onBook: (equipment: Equipment) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Computing':
      return <Cpu className="w-4 h-4" />;
    case 'Development Kit':
      return <Binary className="w-4 h-4" />;
    case '3D Printing':
      return <Layers className="w-4 h-4" />;
    case 'Robotics':
      return <Bot className="w-4 h-4" />;
    case 'Optics & Imaging':
      return <Eye className="w-4 h-4" />;
    case 'Manufacturing':
    case 'Test & Measurement':
    default:
      return <Wrench className="w-4 h-4" />;
  }
};

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  onSelect,
  onBook,
}) => {
  const isAvailable = equipment.status === 'available';
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="bg-[#121311] rounded-[2px] border border-[#232321] hover:border-[#353632] transition-colors flex flex-col justify-between overflow-hidden group"
    >
      <div>
        {/* Visual Header / Imagery Frame */}
        <div
          onClick={() => onSelect(equipment)}
          className="h-40 bg-[#0e0f0d] border-b border-[#232321] relative overflow-hidden cursor-pointer"
        >
          {equipment.imageUrl && !imgError ? (
            <img
              src={equipment.imageUrl}
              alt={equipment.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#151613] text-[#676865]">
              {getCategoryIcon(equipment.category)}
            </div>
          )}

          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f0d] via-black/40 to-black/60 pointer-events-none" />

          {/* Badges on top */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
            <span className="text-[10px] font-mono uppercase bg-[#0a0a09]/80 backdrop-blur-xs text-[#faf8f9] px-2 py-0.5 rounded-[1px] border border-[#232321]">
              {equipment.department}
            </span>

            <Badge variant={equipment.status} size="sm">
              {equipment.status}
            </Badge>
          </div>

          {/* Rating on bottom right */}
          <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 bg-[#0a0a09]/80 backdrop-blur-xs px-2 py-0.5 rounded-[1px] border border-[#232321] text-[11px] font-mono text-[#f0c45a]">
            <Star className="w-3 h-3 fill-[#f0c45a]" />
            <span>{equipment.rating}</span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 text-white/90">
            <div className="w-6 h-6 rounded-[1px] bg-[#121311]/80 backdrop-blur-xs border border-[#232321] flex items-center justify-center text-[#f0c45a]">
              {getCategoryIcon(equipment.category)}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8e8e8c] tracking-wider">
              {equipment.category}
            </span>
            <h3
              onClick={() => onSelect(equipment)}
              className="text-sm font-medium text-[#faf8f9] group-hover:text-[#f0c45a] transition-colors line-clamp-1 cursor-pointer mt-0.5"
            >
              {equipment.name}
            </h3>
          </div>

          <p className="text-xs text-[#8e8e8c] line-clamp-2 leading-relaxed">
            {equipment.description}
          </p>

          <div className="flex items-center justify-between text-[11px] text-[#8e8e8c] pt-2 border-t border-[#232321]">
            <div className="flex items-center gap-1 truncate text-[#e5e5e4]">
              <MapPin className="w-3 h-3 text-[#676865] shrink-0" />
              <span className="truncate">{equipment.location}</span>
            </div>

            <div className="flex items-center gap-1 text-[#676865] font-mono shrink-0">
              <Clock className="w-3 h-3" />
              <span>Max {equipment.maxBookingHours}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onSelect(equipment)}
        >
          View Specs
        </Button>

        <Button
          variant={isAvailable ? 'primary' : 'secondary'}
          size="sm"
          disabled={!isAvailable}
          className="flex-1 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onBook(equipment);
          }}
          icon={<CalendarCheck className="w-3.5 h-3.5" />}
        >
          {isAvailable ? 'Book Slot' : 'In Use'}
        </Button>
      </div>
    </motion.div>
  );
};

export default EquipmentCard;
