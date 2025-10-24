import Transaction from "../models/transaction.models.js";
import { classifyTransaction, classifyBatchTransactions } from "../services/ai.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Add a manual transaction
 * POST /api/transactions/add
 */
export const addTransaction = asyncHandler(async (req, res) => {
  const { description, amount, date, category, type, merchant, autoClassify } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!description || !amount) {
    throw new ApiError(400, "Missing required fields: description, amount");
  }

  if (amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0");
  }

  // If autoClassify is true or category/type not provided, use AI classification
  let finalCategory = category;
  let finalType = type;
  let aiNote = "";

  if (autoClassify || !category || !type) {
    const classification = await classifyTransaction(
      `${description} - ${merchant ? "at " + merchant : ""}`
    );
    finalCategory = classification.category;
    finalType = classification.type;
    aiNote = classification.note;
  }

  const transaction = new Transaction({
    userId,
    description,
    amount,
    date: date ? new Date(date) : new Date(),
    category: finalCategory,
    type: finalType,
    aiNote,
    merchant: merchant || "",
    transactionType: "manual",
  });

  await transaction.save();

  return res.status(201).json(
    new ApiResponse(201, transaction, "Transaction added successfully")
  );
});

/**
 * Get all transactions for a user
 * GET /api/transactions
 */
export const getTransactions = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { category, type, startDate, endDate, page = 1, limit = 20 } = req.query;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const filter = { userId };

  if (category) {
    filter.category = category;
  }

  if (type) {
    filter.type = type;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  const skip = (page - 1) * limit;

  const transactions = await Transaction.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Transaction.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, {
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    }, "Transactions retrieved successfully")
  );
});

/**
 * Get transaction analytics
 * GET /api/transactions/analytics
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { startDate, endDate, groupBy = "category" } = req.query;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const filter = { userId };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  // Get analytics by category or type
  const groupField = groupBy === "type" ? "$type" : "$category";

  const analytics = await Transaction.aggregate([
    { $match: filter },
    {
      $group: {
        _id: groupField,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        average: { $avg: "$amount" },
      },
    },
    { $sort: { total: -1 } },
  ]);

  // Get monthly breakdown
  const monthlyBreakdown = await Transaction.aggregate([
    { $match: filter },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Calculate totals by type
  const byType = await Transaction.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        percentage: { $sum: 1 },
      },
    },
  ]);

  const totalTransactionAmount = byType.reduce((sum, item) => sum + item.total, 0);

  const typeBreakdown = byType.map((item) => ({
    type: item._id,
    total: item.total,
    count: item.percentage,
    percentage: ((item.total / totalTransactionAmount) * 100).toFixed(2),
  }));

  return res.status(200).json(
    new ApiResponse(200, {
      analytics,
      monthlyBreakdown,
      typeBreakdown,
      totalAmount: totalTransactionAmount,
    }, "Analytics retrieved successfully")
  );
});

/**
 * Delete a transaction
 * DELETE /api/transactions/:id
 */
export const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const transaction = await Transaction.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Transaction deleted successfully")
  );
});

/**
 * Update a transaction
 * PUT /api/transactions/:id
 */
export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const { description, amount, date, category, type, merchant } = req.body;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    {
      description,
      amount,
      date,
      category,
      type,
      merchant,
    },
    { new: true }
  );

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res.status(200).json(
    new ApiResponse(200, transaction, "Transaction updated successfully")
  );
});

/**
 * Edit AI classification for a transaction
 * PUT /api/transactions/:id/edit-classification
 */
export const editClassification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const { category, type, merchant, aiNote, confidence } = req.body;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!category || !type) {
    throw new ApiError(400, "Missing required fields: category, type");
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    {
      category,
      type,
      merchant: merchant || "",
      aiNote: aiNote || "",
      confidence: confidence || 100,
    },
    { new: true }
  );

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res.status(200).json(
    new ApiResponse(200, transaction, "Classification updated successfully")
  );
});

/**
 * Delete all transactions for a user
 * DELETE /api/transactions/delete-all
 */
export const deleteAllTransactions = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  // Delete all transactions for this user
  const result = await Transaction.deleteMany({ userId });

  return res.status(200).json(
    new ApiResponse(200, { deletedCount: result.deletedCount }, `Successfully deleted ${result.deletedCount} transactions`)
  );
});

export default {
  addTransaction,
  getTransactions,
  getAnalytics,
  deleteTransaction,
  updateTransaction,
  editClassification,
  deleteAllTransactions,
};
