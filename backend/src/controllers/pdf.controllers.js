import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import Transaction from "../models/transaction.models.js";
import { extractTextFromPDF, cleanExtractedText } from "../services/pdf.service.js";
import { classifyBatchTransactions, generateBatchDescriptions } from "../services/ai.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Upload and parse PDF statement
 * POST /api/transactions/upload-pdf
 */
export const uploadPDFStatement = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  // Try different possible field names
  let file = req.files?.file || req.files?.pdf || Object.values(req.files || {})[0];

  if (!file) {
    throw new ApiError(400, "No file uploaded");
  }

  // Validate file type
  if (file.mimetype !== "application/pdf") {
    throw new ApiError(400, "Only PDF files are allowed");

  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    throw new ApiError(400, "File size must be less than 10MB");
  }

  try {
    // File is already in temp directory from middleware
    const tempFilePath = file.tempFilePath;

    // Extract text from PDF
    let extractedText = await extractTextFromPDF(tempFilePath);
    extractedText = cleanExtractedText(extractedText);

    // Parse transactions from text
    const parsedTransactions = parseTransactionsFromText(extractedText);

    if (parsedTransactions.length === 0) {
      // Clean up temp file
      file.mv('./public/temp/deleted_' + file.name);
      throw new ApiError(400, "No transactions found in the PDF. Please check the file format.");
    }

    // Classify transactions using AI
    const classifiedTransactions = await classifyBatchTransactions(parsedTransactions);

    // Generate improved descriptions for PDF transactions with user preferences
    const improvedDescriptions = await generateBatchDescriptions(parsedTransactions, userId);

    // Save transactions to database
    const batchId = uuidv4();
    const savedTransactions = [];

    for (let i = 0; i < parsedTransactions.length; i++) {
      const parsed = parsedTransactions[i];
      const classified = classifiedTransactions.find((c) => c.index === i + 1);
      const descriptionImprovement = improvedDescriptions.find((d) => d.index === i + 1);

      if (classified) {
        // Use improved description from AI, fallback to original if not available
        const finalDescription = descriptionImprovement?.description || parsed.description;

        const transaction = new Transaction({
          userId,
          description: finalDescription,
          amount: parsed.amount,
          date: parsed.date || new Date(),
          category: classified.category,
          type: classified.type,
          aiNote: classified.note,
          merchant: classified.merchant || "",
          confidence: classified.confidence || 100,
          transactionType: "pdf-extracted",
          batchId,
        });

        await transaction.save();
        savedTransactions.push(transaction);
      }
    }

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    return res.status(201).json(
      new ApiResponse(201, {
        batchId,
        transactionsCount: savedTransactions.length,
        transactions: savedTransactions,
      }, "PDF uploaded and transactions extracted successfully")
    );
  } catch (error) {
    // Clean up temp file if it exists
    if (req.files?.file?.tempFilePath && fs.existsSync(req.files.file.tempFilePath)) {
      fs.unlinkSync(req.files.file.tempFilePath);
    }

    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Error processing PDF: ${error.message}`);
  }
});

/**
 * Parse transactions from extracted text
 * Handles Google Pay statement format with proper extraction
 */
function parseTransactionsFromText(text) {
  const transactions = [];

  // Google Pay pattern that captures:
  // Date & time | Transaction details (Paid to/Received from + Name) | Amount
  // Example: "01 Sep, 2025 12:38 AM Paid to Udemy India LLP UPI Transaction ID: 561019228392 Paid by Canara Bank 3900 ₹399"
  
  // Split by date pattern to get individual transactions
  const dateTimePattern = /(\d{1,2}\s+[A-Za-z]{3},\s+\d{4}\s+\d{1,2}:\d{2}\s+[AP]M)\s+(.+?)(?=\d{1,2}\s+[A-Za-z]{3},\s+\d{4}\s+\d{1,2}:\d{2}\s+[AP]M|$)/gs;
  
  let match;
  while ((match = dateTimePattern.exec(text)) !== null) {
    try {
      const dateStr = match[1]; // "01 Sep, 2025 12:38 AM"
      const transactionDetails = match[2]; // Full transaction text
      
      // Extract amount (₹XXX at the end of transaction details)
      const amountMatch = transactionDetails.match(/₹([\d,]+\.?\d{0,2})/);
      if (!amountMatch) continue;
      
      const amountStr = amountMatch[1].replace(/,/g, "");
      const amount = parseFloat(amountStr);
      
      if (amount <= 0 || amount > 10000000) continue; // Skip invalid amounts
      
      // Extract transaction type and recipient/sender
      let description = "Transaction";
      
      // Look for "Paid to [Name]" pattern
      const paidToMatch = transactionDetails.match(/Paid to\s+([A-Za-z0-9\s\.]+?)(?:\s+UPI|\s+NEFT|\s+IMPS|$)/i);
      if (paidToMatch) {
        description = `Paid to ${paidToMatch[1].trim()}`;
      } else {
        // Look for "Received from [Name]" pattern
        const receivedMatch = transactionDetails.match(/Received from\s+([A-Za-z0-9\s\.]+?)(?:\s+UPI|\s+NEFT|\s+IMPS|$)/i);
        if (receivedMatch) {
          description = `Received from ${receivedMatch[1].trim()}`;
        }
      }
      
      // Parse date
      const date = new Date(dateStr);
      
      if (!isNaN(date.getTime())) {
        transactions.push({
          date,
          description,
          amount,
        });
      }
    } catch (error) {
      continue;
    }
  }

  return transactions;
}

/**
 * Get transactions from a specific batch
 * GET /api/transactions/batch/:batchId
 */
export const getBatchTransactions = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { batchId } = req.params;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const transactions = await Transaction.find({
    userId,
    batchId,
  });

  if (transactions.length === 0) {
    throw new ApiError(404, "No transactions found for this batch");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      batchId,
      count: transactions.length,
      transactions,
    }, "Batch transactions retrieved successfully")
  );
});

export default {
  uploadPDFStatement,
  getBatchTransactions,
};
