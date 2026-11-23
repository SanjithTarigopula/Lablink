import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { formatDate, formatTime } from '../../utils/helpers';

export const RecentBookings: React.FC = () => {
  const { bookings } = useApp();

  const recent = bookings.slice(0, 5);

  return (
    <Card
      title="Recent Laboratory Bookings"
      subtitle="Latest resource allocations requested across departments"
      action={
        <Link
          to="/bookings"
          className="text-xs text-[#8e8e8c] hover:text-[#f0c45a] flex items-center gap-1 group transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      }
    >
      <div className="divide-y divide-[#232321] -mx-5 -my-2">
        {recent.map((booking) => (
          <div
            key={booking.id}
            className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-[#181916] transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xs font-medium text-[#faf8f9] truncate">
                  {booking.equipmentName}
                </h4>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#181916] text-[#8e8e8c] border border-[#232321] rounded-[2px] font-mono">
                  {booking.department}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8e8e8c]">
                <span className="text-[#e5e5e4]">{booking.studentName}</span>
                <span className="flex items-center gap-1 text-[#676865]">
                  <Calendar className="w-3 h-3" />
                  {formatDate(booking.date)}
                </span>
                <span className="flex items-center gap-1 text-[#676865]">
                  <Clock className="w-3 h-3" />
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Badge variant={booking.status} size="sm">
                {booking.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentBookings;
