import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';

const CATEGORIES = [
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

const TYPES = ['Need', 'Want', 'Investment', 'Income', 'Other'];

const TransactionForm = ({ onSuccess }) => {
  const { addTransaction, loading } = useTransactions();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: '',
    merchant: '',
  });

  const [autoClassify, setAutoClassify] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const submitData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        merchant: formData.merchant,
        autoClassify: autoClassify, // Add the autoClassify flag
      };

      // Add category and type only if auto-classify is off
      if (!autoClassify) {
        if (!formData.category || !formData.type) {
          alert('Please select category and type, or enable auto-classify');
          return;
        }
        submitData.category = formData.category;
        submitData.type = formData.type;
      }

      console.log('Submitting transaction data:', submitData);
      await addTransaction(submitData);
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        type: '',
        merchant: '',
      });
      onSuccess?.();
      alert('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Transaction</h2>

      {/* Auto-Classify Toggle */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="autoClassify"
          checked={autoClassify}
          onChange={(e) => setAutoClassify(e.target.checked)}
          className="w-5 h-5 cursor-pointer"
        />
        <label htmlFor="autoClassify" className="text-gray-700 font-medium cursor-pointer">
          ✨ Let AI classify this transaction
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description */}
        <input
          type="text"
          name="description"
          placeholder="Description (e.g., Zomato Order)"
          value={formData.description}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Date */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Merchant */}
        <input
          type="text"
          name="merchant"
          placeholder="Merchant (optional)"
          value={formData.merchant}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category & Type (shown if auto-classify is off) */}
      {!autoClassify && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
