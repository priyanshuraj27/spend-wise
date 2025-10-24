import { useTransactions } from '../context/TransactionContext';

export const useTransactionFilters = () => {
  const { filters, updateFilters } = useTransactions();

  const setCategory = (category) => {
    updateFilters({ category });
  };

  const setType = (type) => {
    updateFilters({ type });
  };

  const setDateRange = (startDate, endDate) => {
    updateFilters({ startDate, endDate });
  };

  const setPage = (page) => {
    updateFilters({ page });
  };

  const clearFilters = () => {
    updateFilters({
      category: null,
      type: null,
      startDate: null,
      endDate: null,
      page: 1,
    });
  };

  return {
    filters,
    setCategory,
    setType,
    setDateRange,
    setPage,
    clearFilters,
  };
};

export const useTransactionStats = () => {
  const { analytics } = useTransactions();

  const getCategoryBreakdown = () => {
    if (!analytics?.analytics) return [];
    return analytics.analytics.map((item) => ({
      name: item._id,
      value: item.total,
      count: item.count,
    }));
  };

  const getTypeBreakdown = () => {
    if (!analytics?.typeBreakdown) return [];
    return analytics.typeBreakdown;
  };

  const getTotalAmount = () => {
    return analytics?.totalAmount || 0;
  };

  const getMonthlyData = () => {
    if (!analytics?.monthlyBreakdown) return [];
    return analytics.monthlyBreakdown.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      total: item.total,
      count: item.count,
    }));
  };

  return {
    categoryBreakdown: getCategoryBreakdown(),
    typeBreakdown: getTypeBreakdown(),
    totalAmount: getTotalAmount(),
    monthlyData: getMonthlyData(),
  };
};

export default {
  useTransactionFilters,
  useTransactionStats,
};
