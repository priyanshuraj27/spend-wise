import React from 'react';
import { useTransactionFilters } from '../../hooks/useTransaction';

const CATEGORIES = [
  'All',
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Investment',
  'Salary',
  'Other',
];

const TYPES = ['All', 'Need', 'Want', 'Investment', 'Income', 'Other'];

const TransactionFilters = () => {
  const { filters, setCategory, setType, setDateRange, clearFilters } =
    useTransactionFilters();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-blue-600 hover:text-blue-800 font-medium transition"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || 'All'}
            onChange={(e) =>
              setCategory(e.target.value === 'All' ? null : e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={filters.type || 'All'}
            onChange={(e) =>
              setType(e.target.value === 'All' ? null : e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) =>
              setDateRange(
                e.target.value || null,
                filters.endDate
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) =>
              setDateRange(
                filters.startDate,
                e.target.value || null
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
