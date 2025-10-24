import React, { useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useTransactionStats } from '../../hooks/useTransaction';
import { formatCurrency } from '../../utils/formatters';
import DashboardCards from './DashboardCards';
import ExpenseChart from '../Analytics/ExpenseChart';
import CategoryBreakdown from '../Analytics/CategoryBreakdown';
import TypeBreakdown from '../Analytics/TypeBreakdown';

const Dashboard = () => {
  const { fetchAnalytics, analytics, loading } = useTransactions();
  const stats = useTransactionStats();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">⌛</div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalAmount = stats.totalAmount;
  const needsAmount = stats.typeBreakdown
    .find((t) => t.type === 'Need')?.total || 0;
  const wantsAmount = stats.typeBreakdown
    .find((t) => t.type === 'Want')?.total || 0;
  const investmentAmount = stats.typeBreakdown
    .find((t) => t.type === 'Investment')?.total || 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Financial Overview
          </h1>
          <p className="text-gray-600 mt-2">
            AI-powered spending insights and analytics
          </p>
        </div>

        {/* Quick Stats Cards */}
        <DashboardCards
          totalAmount={totalAmount}
          needsAmount={needsAmount}
          wantsAmount={wantsAmount}
          investmentAmount={investmentAmount}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Monthly Trend
            </h2>
            <ExpenseChart data={stats.monthlyData} />
          </div>

          {/* Type Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Spending by Type
            </h2>
            <TypeBreakdown data={stats.typeBreakdown} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Spending by Category
          </h2>
          <CategoryBreakdown data={stats.categoryBreakdown} />
        </div>

        {/* AI Insights */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            🤖 AI Insights
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {analytics?.summary || (
              <>
                You're doing great! Keep tracking your expenses regularly.
                <br />
                Upload a bank statement to get AI-powered transaction classification.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
