import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, getMonthName } from '../../utils/formatters';

const ExpenseChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    month: item.month,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="month"
          stroke="#999"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#999"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
          name="Total Spending"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;
