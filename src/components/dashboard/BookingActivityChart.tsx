import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '../ui/Card';

const weeklyData = [
  { day: 'Mon', bookings: 24, hours: 82 },
  { day: 'Tue', bookings: 36, hours: 118 },
  { day: 'Wed', bookings: 42, hours: 146 },
  { day: 'Thu', bookings: 38, hours: 130 },
  { day: 'Fri', bookings: 54, hours: 184 },
  { day: 'Sat', bookings: 28, hours: 94 },
  { day: 'Sun', bookings: 16, hours: 52 },
];

export const BookingActivityChart: React.FC = () => {
  return (
    <Card
      title="Weekly Booking Activity & Usage Volume"
      subtitle="Total hours booked and student sessions logged"
      className="h-full"
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f0c45a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f0c45a" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ece8df" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ece8df" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#232321" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: '#232321' }}
              tick={{ fill: '#676865', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#676865', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#121311',
                borderColor: '#232321',
                borderRadius: '2px',
                fontSize: '12px',
                color: '#faf8f9',
              }}
              labelStyle={{ color: '#8e8e8c', marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              name="Lab Hours"
              stroke="#ece8df"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorHours)"
            />
            <Area
              type="monotone"
              dataKey="bookings"
              name="Booking Sessions"
              stroke="#f0c45a"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorBookings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-[#232321] text-xs text-[#8e8e8c]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-1 bg-[#f0c45a] rounded-none" />
          <span>Active Bookings</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-1 bg-[#ece8df] rounded-none" />
          <span>Total Machine Hours</span>
        </div>
      </div>
    </Card>
  );
};

export default BookingActivityChart;
