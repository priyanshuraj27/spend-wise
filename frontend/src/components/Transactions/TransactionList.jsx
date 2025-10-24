import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency, formatDate, getCategoryIcon, getTypeIcon, getTypeColor } from '../../utils/formatters';
import TransactionForm from './TransactionForm';
import TransactionFilters from './TransactionFilters';
import TransactionEditModal from './TransactionEditModal';

const TransactionList = () => {
  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    deleteTransaction,
    deleteAllTransactions,
    updateTransaction,
    editClassification,
  } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">⌛</div>
          <p className="text-lg text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        if (paginatedTransactions.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        alert('Failed to delete transaction');
      }
    }
  };

  const handleDeleteAll = async () => {
    if (
      window.confirm(
        `⚠️ WARNING: You are about to permanently delete ALL ${transactions.length} transactions!\n\nThis action CANNOT be undone. Are you absolutely sure?`
      )
    ) {
      // Second confirmation to be extra sure
      if (
        window.confirm(
          `This is your final confirmation. Delete all ${transactions.length} transactions? YES or NO?`
        )
      ) {
        setIsDeleting(true);
        try {
          await deleteAllTransactions();
          setCurrentPage(1);
          alert('✅ All transactions have been successfully deleted');
        } catch (err) {
          alert('❌ Failed to delete all transactions');
          console.error('Error deleting all transactions:', err);
        } finally {
          setIsDeleting(false);
        }
      }
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSaveTransaction = async (updatedData) => {
    try {
      await updateTransaction(editingTransaction._id, updatedData);
      setEditingTransaction(null);
    } catch (err) {
      alert('Failed to update transaction');
      console.error('Error updating transaction:', err);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transactions
              </h1>
              <p className="text-gray-600 mt-2">
                Total Transactions: <span className="font-bold text-gray-800">{transactions.length}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition transform hover:scale-105 font-semibold flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Add Transaction</span>
              </button>
              {transactions.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  disabled={isDeleting}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition transform hover:scale-105 font-semibold flex items-center space-x-2 disabled:opacity-50"
                  title="Delete all transactions - requires confirmation"
                >
                  <span>🗑️</span>
                  <span>{isDeleting ? 'Deleting...' : 'Delete All'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Transaction Form */}
          {showForm && (
            <div className="mb-8 bg-white rounded-xl shadow-xl p-8 border-t-4 border-blue-600">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Transaction</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              <TransactionForm onSuccess={() => setShowForm(false)} />
            </div>
          )}

          {/* Filters */}
          <TransactionFilters />
        </div>

        {/* Transactions Grid */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-2xl text-gray-600 mb-2">No transactions yet</p>
            <p className="text-gray-500 mb-6">Start by adding your first transaction</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition font-semibold"
            >
              Add Your First Transaction
            </button>
          </div>
        ) : (
          <>
            {/* Transactions Cards */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              {paginatedTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-[1.02] overflow-hidden border-l-4"
                  style={{ borderLeftColor: getTypeColor(transaction.type) }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-4xl">{getCategoryIcon(transaction.category)}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 truncate">
                            {transaction.description}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>

                    {/* Tags/Badges */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        <span>{getCategoryIcon(transaction.category)}</span>
                        <span>{transaction.category}</span>
                      </span>
                      <span
                        className="inline-flex items-center space-x-1 px-3 py-1 text-white rounded-full text-sm font-medium"
                        style={{ backgroundColor: getTypeColor(transaction.type) }}
                      >
                        <span>{getTypeIcon(transaction.type)}</span>
                        <span>{transaction.type}</span>
                      </span>
                      {transaction.merchant && (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          <span>🏪</span>
                          <span>{transaction.merchant}</span>
                        </span>
                      )}
                      {transaction.confidence && (
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(transaction.confidence)}`}>
                          <span>✓</span>
                          <span>{transaction.confidence}% Confidence</span>
                        </span>
                      )}
                    </div>

                    {/* AI Note */}
                    {transaction.aiNote && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-3 mb-4 rounded">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-yellow-700">💡 AI Note:</span> {transaction.aiNote}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        {transaction.transactionType === 'pdf-extracted' ? '📄 PDF Extracted' : '✍️ Manual Entry'}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditClick(transaction)}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold flex items-center space-x-2"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold flex items-center space-x-2"
                        >
                          <span>🗑️</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
                <div className="text-gray-600 font-medium">
                  Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} transactions
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    ← Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg font-semibold transition ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionList;
