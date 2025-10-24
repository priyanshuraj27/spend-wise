import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/environment.js";
import { getPreferenceExamples } from "./preference.service.js";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

/**
 * Classify transactions using Gemini API
 * @param {string} transactionText - Description of the transaction
 * @returns {Promise<Object>} - Classification result with category, type, and note
 */
export const classifyTransaction = async (transactionText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a financial expert AI. Analyze the following transaction description and classify it.

Transaction: "${transactionText}"

Respond with a JSON object (and ONLY JSON, no other text) with these fields:
- category: One of ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Healthcare", "Education", "Investment", "Salary", "Other"]
- type: One of ["Need", "Want", "Investment", "Income", "Other"]
- merchant: Extract merchant name if available, otherwise ""
- confidence: Number between 0-100 indicating confidence in classification
- note: A brief AI-generated insight (2-3 sentences) about this transaction in simple language

Example response format:
{
  "category": "Food",
  "type": "Want",
  "merchant": "Zomato",
  "confidence": 95,
  "note": "Food delivery classified as discretionary Want. Consider limiting dining expenses to save more each month."
}

Classify the transaction above:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textContent = response.text();

    // Parse JSON response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from response");
    }

    const classification = JSON.parse(jsonMatch[0]);
    return classification;
  } catch (error) {
    console.error("Error classifying transaction:", error);
    throw new Error(`Transaction classification failed: ${error.message}`);
  }
};

/**
 * Generate batch classification for multiple transactions
 * @param {Array<Object>} transactions - Array of transaction objects with description and amount
 * @returns {Promise<Array>} - Array of classified transactions
 */
export const classifyBatchTransactions = async (transactions) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const transactionList = transactions
      .map(
        (t, i) =>
          `${i + 1}. Date: ${t.date || "N/A"}, Description: "${t.description}", Amount: ${t.amount}`
      )
      .join("\n");

    const prompt = `You are a financial expert AI. Analyze and classify the following transactions.

Transactions:
${transactionList}

For each transaction, respond with a JSON array where each object has these fields:
- index: Transaction number from the list
- category: One of ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Healthcare", "Education", "Investment", "Salary", "Other"]
- type: One of ["Need", "Want", "Investment", "Income", "Other"]
- merchant: Extract merchant name if available, otherwise ""
- confidence: Number between 0-100
- note: Brief AI insight (1-2 sentences)

Respond with ONLY a valid JSON array, no other text.

Example format:
[
  {
    "index": 1,
    "category": "Food",
    "type": "Want",
    "merchant": "Zomato",
    "confidence": 95,
    "note": "Food delivery - discretionary spending"
  }
]

Classify all transactions:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textContent = response.text();

    // Parse JSON response
    const jsonMatch = textContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON array from response");
    }

    const classifications = JSON.parse(jsonMatch[0]);
    return classifications;
  } catch (error) {
    console.error("Error batch classifying transactions:", error);
    throw new Error(`Batch classification failed: ${error.message}`);
  }
};

/**
 * Generate a better description for PDF extracted transactions
 * @param {string} rawDescription - Raw description from PDF
 * @param {string} category - Transaction category
 * @param {string} type - Transaction type
 * @param {string} amount - Transaction amount
 * @returns {Promise<string>} - Improved description
 */
export const generateTransactionDescription = async (rawDescription, category, type, amount) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a financial assistant. Improve the following transaction description to make it more readable and informative.

Original Description: "${rawDescription}"
Category: ${category}
Type: ${type}
Amount: ₹${amount}

Generate a concise, natural description (max 50 characters) that:
1. Clearly identifies WHO received the payment (person name, company, app, etc.)
2. Describes WHAT was the transaction for
3. Is easy to understand
4. Is grammatically correct
5. Removes unnecessary characters or codes

Examples of good descriptions:
- "Payment to Tanmay"
- "Dinner at Zomato"
- "Course on Udemy"
- "Shopping at Amazon"
- "Electricity bill payment"
- "Transfer to Bhola"
- "Netflix subscription"

Respond with ONLY the improved description text, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedDescription = response.text().trim();
    
    // Fallback if response is too long or empty
    return improvedDescription && improvedDescription.length < 100 
      ? improvedDescription 
      : rawDescription;
  } catch (error) {
    console.error("Error generating transaction description:", error);
    // Return original description if AI fails
    return rawDescription;
  }
};

/**
 * Generate batch descriptions for multiple transactions with user preferences
 * @param {Array<Object>} transactions - Array of transaction objects with full text
 * @param {string} userId - User ID to fetch preferences
 * @returns {Promise<Array>} - Array with improved descriptions
 */
export const generateBatchDescriptions = async (transactions, userId = null) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create detailed transaction list with full text for AI to analyze
    const transactionList = transactions
      .map(
        (t, i) =>
          `${i + 1}. Full Text: "${t.description}", Amount: ₹${t.amount}`
      )
      .join("\n");

    // Get user's preferences to use as examples if userId provided
    let userPreferencesText = "";
    if (userId) {
      try {
        const examples = await getPreferenceExamples(userId, 5);
        if (examples.length > 0) {
          userPreferencesText = `\n\nUser's preferences (follow these patterns when similar):
${examples
  .map(
    (ex) =>
      `- "${ex.merchant}" → "${ex.description}" (Category: ${ex.category}, Type: ${ex.type})${
        ex.tags.length > 0 ? `, Tags: ${ex.tags.join(", ")}` : ""
      }`
  )
  .join("\n")}`;
        }
      } catch (error) {
        // Proceed without preferences if fetch fails
      }
    }

    const prompt = `You are a financial assistant specializing in transaction analysis. Generate natural, descriptive transaction descriptions for personal finance tracking.

Transactions to describe:
${transactionList}${userPreferencesText}

For each transaction, create a concise description (max 50 characters) that:
1. Clearly identifies WHO the money went to (person name, business, app, service, etc.)
2. Describes WHAT was purchased/transferred
3. Uses natural language like "Payment to [name]" or "Purchased on [app]"
4. Is easy to understand and read

Examples of natural descriptions:
- "Payment to Tanmay" (for person-to-person transfers)
- "Dinner at Zomato" (for food delivery)
- "Course purchase on Udemy" (for online courses)
- "Shopping at Amazon" (for online shopping)
- "Phone bill payment" (for utility bills)
- "Transfer to Bhola" (for another person)
- "Netflix subscription" (for subscriptions)
- "Coffee at Starbucks" (for dining)
- "Groceries at Big Basket" (for grocery shopping)

Respond with ONLY a valid JSON array where each object has "index" and "description" fields, no other text.

Example format:
[
  {"index": 1, "description": "Payment to Tanmay"},
  {"index": 2, "description": "Course on Udemy"}
]

Generate descriptions for all transactions:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textContent = response.text();

    // Parse JSON response
    const jsonMatch = textContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // Return original descriptions if parsing fails
      return transactions.map((t, i) => ({
        index: i + 1,
        description: t.description,
      }));
    }

    const improvements = JSON.parse(jsonMatch[0]);
    return improvements;
  } catch (error) {
    console.error("Error batch generating descriptions:", error);
    // Return original descriptions if AI fails
    return transactions.map((t, i) => ({
      index: i + 1,
      description: t.description,
    }));
  }
};

/**
 * Generate AI summary and insights for a period
 * @param {Array<Object>} transactions - Array of classified transactions
 * @returns {Promise<string>} - AI-generated summary with insights
 */
export const generateFinancialSummary = async (transactions) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Group transactions by category and type
    const summary = {
      total: 0,
      byCategory: {},
      byType: {},
      byMonth: {},
    };

    transactions.forEach((t) => {
      summary.total += t.amount;
      summary.byCategory[t.category] = (summary.byCategory[t.category] || 0) + t.amount;
      summary.byType[t.type] = (summary.byType[t.type] || 0) + t.amount;
    });

    const prompt = `You are a personal finance advisor. Based on the following transaction summary, generate a brief but insightful financial summary (3-4 sentences).

Transaction Summary:
- Total Spending: ₹${summary.total.toFixed(2)}
- By Category: ${JSON.stringify(summary.byCategory)}
- By Type: ${JSON.stringify(summary.byType)}
- Total Transactions: ${transactions.length}

Include:
1. Overall spending pattern observation
2. Main spending categories
3. One actionable suggestion for better spending habits

Keep the tone encouraging and practical. Respond with ONLY the summary text, no JSON or markup.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating financial summary:", error);
    throw new Error(`Summary generation failed: ${error.message}`);
  }
};

export default {
  classifyTransaction,
  classifyBatchTransactions,
  generateTransactionDescription,
  generateBatchDescriptions,
  generateFinancialSummary,
};
