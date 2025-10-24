/**
 * Format currency with Indian Rupee
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date to readable format
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  } catch (err) {
    console.error('Error formatting date:', date, err);
    return 'N/A';
  }
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (err) {
    console.error('Error formatting date time:', date, err);
    return 'N/A';
  }
};

/**
 * Get category color
 */
export const getCategoryColor = (category) => {
  const colors = {
    'Food': '#FF6B6B',
    'Travel': '#4ECDC4',
    'Shopping': '#45B7D1',
    'Bills': '#96CEB4',
    'Entertainment': '#FFEAA7',
    'Healthcare': '#DDA15E',
    'Education': '#BC6C25',
    'Investment': '#06A77D',
    'Salary': '#2D6A4F',
    'Other': '#999999',
  };
  return colors[category] || '#999999';
};

/**
 * Get type color
 */
export const getTypeColor = (type) => {
  const colors = {
    'Need': '#2ECC71',
    'Want': '#E74C3C',
    'Investment': '#3498DB',
    'Income': '#27AE60',
    'Other': '#95A5A6',
  };
  return colors[type] || '#95A5A6';
};

/**
 * Get type icon
 */
export const getTypeIcon = (type) => {
  const icons = {
    'Need': '💳',
    'Want': '🎉',
    'Investment': '📈',
    'Income': '💰',
    'Other': '📝',
  };
  return icons[type] || '📝';
};

/**
 * Get category icon
 */
export const getCategoryIcon = (category) => {
  const icons = {
    'Food': '🍔',
    'Travel': '✈️',
    'Shopping': '🛍️',
    'Bills': '📄',
    'Entertainment': '🎬',
    'Healthcare': '🏥',
    'Education': '📚',
    'Investment': '📈',
    'Salary': '💼',
    'Other': '📍',
  };
  return icons[category] || '📍';
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

/**
 * Get month name
 */
export const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || '';
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  getCategoryColor,
  getTypeColor,
  getTypeIcon,
  getCategoryIcon,
  calculatePercentage,
  getMonthName,
};
