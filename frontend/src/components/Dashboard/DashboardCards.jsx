import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const DashboardCards = ({
  totalAmount,
  needsAmount,
  wantsAmount,
  investmentAmount,
}) => {
  const cards = [
    {
      title: 'Total Spending',
      amount: totalAmount,
      icon: '💰',
      bgGradient: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-600',
    },
    {
      title: 'Needs',
      amount: needsAmount,
      icon: '�',
      bgGradient: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600',
    },
    {
      title: 'Wants',
      amount: wantsAmount,
      icon: '�',
      bgGradient: 'from-orange-500 to-red-600',
      textColor: 'text-orange-600',
    },
    {
      title: 'Investments',
      amount: investmentAmount,
      icon: '📈',
      bgGradient: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.bgGradient} rounded-xl shadow-lg p-6 text-white transform transition hover:shadow-xl hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white/90 text-sm uppercase tracking-wide">
              {card.title}
            </h3>
            <span className="text-3xl">{card.icon}</span>
          </div>
          <p className="text-3xl font-bold">
            {formatCurrency(card.amount)}
          </p>
          <p className="text-white/70 text-xs mt-2">
            {card.title.toLowerCase()} tracker
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
