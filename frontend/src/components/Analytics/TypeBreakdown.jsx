import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTypeColor, formatCurrency } from '../../utils/formatters';

const TypeBreakdown = ({ data }) => {
  const chartData = data.map((item) => ({
    type: item.type,
    total: item.total,
    percentage: parseFloat(item.percentage),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].payload.type}</p>
          <p className="text-blue-600 font-bold">{formatCurrency(payload[0].value)}</p>
          <p className="text-gray-600 text-sm">{payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="type" stroke="#999" style={{ fontSize: '12px' }} />
        <YAxis
          stroke="#999"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="total"
          fill="#3b82f6"
          radius={[8, 8, 0, 0]}
          name="Amount"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TypeBreakdown;
