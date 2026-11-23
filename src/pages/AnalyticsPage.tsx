import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Activity, Package, Clock, AlertCircle, BarChart2, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { analyticsData } from '../data/analytics';
import { useApp } from '../context/AppContext';

// ─── Industrial Dark Palette ──────────────────────────────────────────────────
const GOLD = '#f0c45a';
const SILVER = '#ece8df';
const MUTED = '#676865';
const BORDER = '#232321';

const PIE_COLORS = ['#f0c45a', '#ece8df', '#38bdf8', '#4ade80', '#fb923c', '#f87171', '#a78bfa', '#2dd4bf'];

// ─── Custom Dark Tooltip ───────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#121311] border border-[#232321] rounded-[2px] p-2.5 text-xs shadow-xl">
      {label && <p className="font-mono text-[#8e8e8c] mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center gap-1.5" style={{ color: p.color || GOLD }}>
          <span>{p.name ? `${p.name}: ` : ''}</span>
          <span className="font-mono text-[#faf8f9] font-medium">{p.value}{p.unit || ''}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface AnalyticsStatProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}

const AnalyticsStat: React.FC<AnalyticsStatProps> = ({ label, value, sub, icon }) => (
  <div className="bg-[#121311] rounded-[2px] border border-[#232321] p-5 flex items-start gap-3.5">
    <div className="w-8 h-8 rounded-[2px] bg-[#181916] border border-[#232321] flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-mono text-[#8e8e8c] uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-mono font-medium text-[#faf8f9] mt-0.5">{value}</p>
      <p className="text-[11px] text-[#676865] mt-0.5">{sub}</p>
    </div>
  </div>
);

// ─── Utilization Donut ────────────────────────────────────────────────────────
const UtilizationDonut: React.FC<{ value: number }> = ({ value }) => {
  const data = [
    { name: 'Utilized', value },
    { name: 'Idle Capacity', value: 100 - value },
  ];
  return (
    <div className="relative h-48 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={54}
            outerRadius={74}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={GOLD} />
            <Cell fill="#1a1b18" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-mono font-medium text-[#faf8f9]">{value}%</span>
        <span className="text-[10px] text-[#8e8e8c] uppercase tracking-wider font-mono">active fleet</span>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const AnalyticsPage: React.FC = () => {
  const { bookings, equipment } = useApp();
  const [trendPeriod, setTrendPeriod] = useState('ytd');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const totalBookings = bookings.length + 1234;
  const activeEquipment = equipment.length;
  const peakHour = '15:00';

  const trendData = useMemo(() => {
    if (trendPeriod === 'q4') return analyticsData.bookingTrends.slice(-3);
    if (trendPeriod === 'h2') return analyticsData.bookingTrends.slice(-6);
    return analyticsData.bookingTrends;
  }, [trendPeriod]);

  const filteredDeptData = useMemo(() => {
    if (selectedDept === 'All') return analyticsData.departmentUtilization;
    return analyticsData.departmentUtilization.filter((d) => d.department === selectedDept);
  }, [selectedDept]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-[#faf8f9] tracking-tight">Resource Utilization Analytics</h2>
          <p className="text-xs text-[#8e8e8c] mt-0.5">Telemetry metrics, department load factors and utilization trends across campus</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#181916] text-[#f0c45a] text-xs font-mono border border-[#232321]">
            <Activity size={12} />
            Telemetry Live
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <AnalyticsStat
          label="Overall Utilization"
          value={`${analyticsData.overallUtilization}%`}
          sub="Fleet-wide load index"
          icon={<TrendingUp size={16} className="text-[#f0c45a]" />}
        />
        <AnalyticsStat
          label="Total Bookings"
          value={totalBookings.toLocaleString()}
          sub="Total logged sessions"
          icon={<BarChart2 size={16} className="text-[#ece8df]" />}
        />
        <AnalyticsStat
          label="Active Instruments"
          value={`${activeEquipment}`}
          sub="Across 6 engineering labs"
          icon={<Package size={16} className="text-[#38bdf8]" />}
        />
        <AnalyticsStat
          label="Peak Load Window"
          value={peakHour}
          sub="Highest session concurrency"
          icon={<Clock size={16} className="text-[#4ade80]" />}
        />
      </div>

      {/* Booking Trends + Utilization Donut */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card
          className="xl:col-span-2"
          header={{
            title: 'Booking Trends & Concurrency',
            subtitle: 'Monthly reservation volume trajectory across the academic year',
            action: (
              <Select
                value={trendPeriod}
                onChange={(e) => setTrendPeriod(e.target.value)}
                className="text-xs py-1 h-7.5 w-36"
                options={[
                  { value: 'ytd', label: 'Year to Date' },
                  { value: 'h2', label: 'Last 6 Months' },
                  { value: 'q4', label: 'Last 3 Months' },
                ]}
              />
            ),
          }}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bookingDarkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: MUTED }} axisLine={{ stroke: BORDER }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  name="Bookings"
                  stroke={GOLD}
                  strokeWidth={1.5}
                  fill="url(#bookingDarkGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: GOLD }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card header={{ title: 'Fleet Utilization', subtitle: 'Average active duty cycle' }}>
          <UtilizationDonut value={analyticsData.overallUtilization} />
          <div className="mt-4 space-y-2 border-t border-[#232321] pt-3">
            {analyticsData.departmentUtilization.slice(0, 3).map((d) => (
              <div key={d.department} className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#8e8e8c] w-24 shrink-0">{d.department}</span>
                <div className="flex-1 bg-[#181916] border border-[#232321] rounded-none h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#f0c45a]"
                    style={{ width: `${d.utilization}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-[#faf8f9] w-12 text-right">{d.utilization}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Department Utilization + Peak Hours */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card
          header={{
            title: 'Department-wise Utilization',
            subtitle: 'Comparative load factor across laboratories',
            action: (
              <Select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs py-1 h-7.5 w-36"
                options={[
                  { value: 'All', label: 'All Depts' },
                  ...analyticsData.departmentUtilization.map((d) => ({
                    value: d.department,
                    label: d.department,
                  })),
                ]}
              />
            ),
          }}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredDeptData}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 16, bottom: 0 }}
                barSize={12}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: MUTED }}
                  axisLine={{ stroke: BORDER }}
                  tickLine={false}
                  unit="%"
                />
                <YAxis
                  dataKey="department"
                  type="category"
                  tick={{ fontSize: 11, fill: '#8e8e8c' }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="utilization" name="Utilization" fill={GOLD} radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card header={{ title: 'Peak Usage Hours', subtitle: 'Hourly load distribution by time-of-day' }}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.peakHours}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                barSize={18}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: MUTED }} axisLine={{ stroke: BORDER }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="bookings" name="Bookings" radius={0}>
                  {analyticsData.peakHours.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.bookings === Math.max(...analyticsData.peakHours.map(h => h.bookings)) ? GOLD : '#282924'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Most Booked + Category Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card header={{ title: 'High-Demand Fleet Roster', subtitle: 'Most frequently utilized laboratory assets' }}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.mostBooked}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
                barSize={10}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: MUTED }}
                  axisLine={{ stroke: BORDER }}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10, fill: '#8e8e8c' }}
                  axisLine={false}
                  tickLine={false}
                  width={170}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="bookings" name="Sessions" fill={SILVER} radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card header={{ title: 'Category Load Distribution', subtitle: 'Fleet share by equipment discipline' }}>
          <div className="h-72 flex items-center">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analyticsData.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={76}
                    dataKey="count"
                    nameKey="category"
                    strokeWidth={1}
                    stroke="#121311"
                  >
                    {analyticsData.categoryDistribution.map((_, i) => (
                      <Cell key={`cat-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [val, 'Count']}
                    contentStyle={{ backgroundColor: '#121311', borderColor: '#232321', borderRadius: '2px', color: '#faf8f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-1.5 pl-2">
              {analyticsData.categoryDistribution.map((item, i) => (
                <div key={item.category} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-none shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-xs text-[#8e8e8c] truncate flex-1">{item.category}</span>
                  <span className="text-xs font-mono text-[#faf8f9]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Underutilized Equipment */}
      <Card
        header={{
          title: 'Underutilized Equipment',
          subtitle: 'Instruments with capacity surplus available for immediate student booking',
          action: (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#221b0c] text-[#f0c45a] rounded-[1px] text-xs font-mono border border-[#3d3015]">
              <AlertCircle size={11} />
              {analyticsData.underutilized.length} items flagged
            </span>
          ),
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#232321] text-[#8e8e8c] font-mono text-left">
                <th className="py-2.5 px-4 font-normal uppercase tracking-wider">Equipment</th>
                <th className="py-2.5 px-4 font-normal uppercase tracking-wider">Duty Cycle</th>
                <th className="py-2.5 px-4 font-normal uppercase tracking-wider">Load State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232321]">
              {analyticsData.underutilized.map((item) => (
                <tr key={item.name} className="hover:bg-[#181916] transition-colors">
                  <td className="py-3 px-4 font-medium text-[#faf8f9]">{item.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-[#181916] border border-[#232321] rounded-none h-1.5 overflow-hidden max-w-[160px]">
                        <div
                          className="h-full rounded-none"
                          style={{
                            width: `${item.utilization}%`,
                            backgroundColor: item.utilization < 40 ? '#f87171' : '#f0c45a',
                          }}
                        />
                      </div>
                      <span className="font-mono text-[#faf8f9]">{item.utilization}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[1px] text-[10px] font-mono border ${
                        item.utilization < 40
                          ? 'bg-[#241113] text-[#f87171] border-[#441a1d]'
                          : 'bg-[#221b0c] text-[#f0c45a] border-[#3d3015]'
                      }`}
                    >
                      <Zap size={10} />
                      {item.utilization < 40 ? 'LOW LOAD' : 'SURPLUS CAPACITY'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
