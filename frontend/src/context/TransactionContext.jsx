import React, { createContext, useContext, useState, useCallback } from 'react';
import { transactionAPI } from '../services/api';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: null,
    type: null,
    startDate: null,
    endDate: null,
    page: 1,
    limit: 20,
  });

  // Fetch transactions with current filters
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionAPI.getTransactions(filters);
      console.log('Fetch transactions response:', response);
      
      // Handle response format from backend
      const transactionList = response.data?.transactions || response.message?.transactions || [];
      setTransactions(transactionList);
      return response.data || response.message || {};
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async (dateRange = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionAPI.getAnalytics(dateRange);
      console.log('Fetch analytics response:', response);
      
      // Handle response format
      const analyticsData = response.data || response.message || {};
      setAnalytics(analyticsData);
      return analyticsData;
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new transaction
  const addTransaction = useCallback(async (transactionData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Adding transaction:', transactionData);
      const response = await transactionAPI.addTransaction(transactionData);
      console.log('Add transaction response:', response);
      
      // Handle both response formats
      const transaction = response.data || response.message || response;
      
      setTransactions((prev) => [transaction, ...prev]);
      return transaction;
    } catch (err) {
      const errorMsg = err.message || 'Failed to add transaction';
      setError(errorMsg);
      console.error('Error adding transaction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update transaction
  const updateTransaction = useCallback(async (id, transactionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionAPI.updateTransaction(id, transactionData);
      const updated = response.data || response.message || {};
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update transaction');
      console.error('Error updating transaction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await transactionAPI.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete transaction');
      console.error('Error deleting transaction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete all transactions
  const deleteAllTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await transactionAPI.deleteAllTransactions();
      setTransactions([]);
    } catch (err) {
      setError(err.message || 'Failed to delete all transactions');
      console.error('Error deleting all transactions:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Edit classification (re-categorize with AI)
  const editClassification = useCallback(async (id, data) => {
    try {
      console.log('Editing classification for transaction:', id, data);
      const response = await transactionAPI.editClassification(id, data);
      console.log('Edit classification response:', response);
      
      // Update the transaction in the list with the new classification
      const updatedTransaction = response.data || response.message || {};
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? updatedTransaction : t))
      );
      
      return updatedTransaction;
    } catch (err) {
      setError(err.message || 'Failed to edit classification');
      console.error('Error editing classification:', err);
      throw err;
    }
  }, []);

  // Upload PDF
  const uploadPDF = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Uploading PDF:', file.name);
      const response = await transactionAPI.uploadPDF(file);
      console.log('Upload PDF response:', response);
      
      // Handle response format: { statusCode, message: { batchId, transactionsCount, transactions }, data, success }
      const transactions = response.data?.transactions || response.message?.transactions || [];
      console.log('Extracted transactions:', transactions.length);
      
      // Add newly extracted transactions to the list
      if (transactions.length > 0) {
        setTransactions((prev) => [
          ...transactions,
          ...prev,
        ]);
      }
      
      return response.data || response.message || {};
    } catch (err) {
      const errorMsg = err.message || 'Failed to upload PDF';
      setError(errorMsg);
      console.error('Error uploading PDF:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page on filter change
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    transactions,
    analytics,
    loading,
    error,
    filters,
    fetchTransactions,
    fetchAnalytics,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
    editClassification,
    uploadPDF,
    updateFilters,
    clearError,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};

export default TransactionContext;
