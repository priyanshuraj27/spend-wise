import React, { useState } from 'react';
import { formatDate } from '../../utils/formatters';

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

const TransactionEditModal = ({ transaction, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    description: transaction.description || '',
    amount: transaction.amount || '',
    date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
    category: transaction.category || '',
    type: transaction.type || '',
    merchant: transaction.merchant || '',
    aiNote: transaction.aiNote || '',
  });

  const [saveAsPreference, setSaveAsPreference] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount || !formData.category || !formData.type) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);

      // Save as preference if checked
      if (saveAsPreference && formData.merchant?.trim()) {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`${import.meta.env.VITE_API_URL}/preferences/save`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              originalMerchant: formData.merchant.trim(),
              preferredDescription: formData.description.trim(),
              category: formData.category,
              type: formData.type,
              customTags: [],
            }),
          });

          if (!response.ok) {
            console.error('Could not save preference:', response.statusText);
          }
        } catch (error) {
          console.error('Error saving preference:', error);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Transaction</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              placeholder="Enter transaction description"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Amount * (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            >
              <option value="">Select Type</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Merchant (Optional)
            </label>
            <input
              type="text"
              name="merchant"
              value={formData.merchant}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              placeholder="e.g., Starbucks, Amazon"
            />
          </div>

          {/* AI Note */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              AI Note (Optional)
            </label>
            <textarea
              name="aiNote"
              value={formData.aiNote}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
              placeholder="Add custom notes about this transaction"
              rows="3"
            />
          </div>

          {/* Save as Preference Checkbox */}
          {formData.merchant?.trim() && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsPreference}
                  onChange={(e) => setSaveAsPreference(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  💾 Save this as a preference for "{formData.merchant}"
                </span>
              </label>
              <p className="text-xs text-gray-600 ml-8 mt-1">
                We'll remember this description and category for similar transactions
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
            >
              {isSaving ? '💾 Saving...' : '✓ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionEditModal;
