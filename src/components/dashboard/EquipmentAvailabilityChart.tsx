import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';

export const EquipmentAvailabilityChart: React.FC = () => {
  const { equipment } = useApp();

  const counts = {
    available: equipment.filter((e) => e.status === 'available').length,
    'in-use': equipment.filter((e) => e.status === 'in-use').length,
    reserved: equipment.filter((e) => e.status === 'reserved').length,
    maintenance: equipment.filter((e) => e.status === 'maintenance').length,
  };

  const data = [
    { name: 'Available', value: counts.available, color: '#22c55e' },
    { name: 'In Use', value: counts['in-use'], color: '#f0c45a' },
    { name: 'Reserved', value: counts.reserved, color: '#60a5fa' },
    { name: 'Maintenance', value: counts.maintenance, color: '#ef4444' },
  ];

  return (
    <Card
      title="Equipment Availability Status"
      subtitle="Live fleet distribution across 6 labs"
      className="h-full"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-52 w-52 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: any, name: any) => [`${value} units`, name]}
                contentStyle={{
                  backgroundColor: '#121311',
                  borderColor: '#232321',
                  borderRadius: '2px',
                  fontSize: '12px',
                  color: '#faf8f9',
                }}
              />
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-semibold text-[#faf8f9]">{equipment.length}</span>
            <span className="text-[10px] text-[#8e8e8c] uppercase tracking-wider font-mono">Total Units</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-2 rounded-[2px] bg-[#0e0f0d] border border-[#232321] text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: item.color }} />
                <span className="text-[#8e8e8c]">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#faf8f9]">{item.value} units</span>
                <span className="text-[10px] text-[#676865]">
                  ({Math.round((item.value / equipment.length) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default EquipmentAvailabilityChart;
