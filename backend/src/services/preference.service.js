import TransactionPreference from "../models/transactionPreference.models.js";

/**
 * Save or update a transaction preference
 * @param {string} userId - User ID
 * @param {string} originalMerchant - Original merchant/description from PDF
 * @param {string} preferredDescription - User's preferred description
 * @param {string} category - Preferred category
 * @param {string} type - Preferred type
 * @param {Array<string>} customTags - Custom tags user added
 * @returns {Promise<Object>} - Saved preference
 */
export const saveTransactionPreference = async (
  userId,
  originalMerchant,
  preferredDescription,
  category,
  type,
  customTags = []
) => {
  try {
    // Check if preference already exists
    const existingPreference = await TransactionPreference.findOne({
      userId,
      originalMerchant: originalMerchant.toLowerCase(),
    });

    if (existingPreference) {
      // Update existing preference
      existingPreference.preferredDescription = preferredDescription;
      existingPreference.category = category;
      existingPreference.type = type;
      existingPreference.customTags = customTags;
      existingPreference.usageCount += 1;
      // Increase confidence with each use
      existingPreference.confidence = Math.min(100, existingPreference.confidence + 5);
      await existingPreference.save();
      return existingPreference;
    } else {
      // Create new preference
      const newPreference = new TransactionPreference({
        userId,
        originalMerchant: originalMerchant.toLowerCase(),
        preferredDescription,
        category,
        type,
        customTags,
        usageCount: 1,
        confidence: 50,
      });
      await newPreference.save();
      return newPreference;
    }
  } catch (error) {
    console.error("Error saving transaction preference:", error);
    throw error;
  }
};

/**
 * Get user's transaction preferences
 * @param {string} userId - User ID
 * @param {number} limit - Max number of preferences to return
 * @returns {Promise<Array>} - User's preferences sorted by usage
 */
export const getUserPreferences = async (userId, limit = 20) => {
  try {
    const preferences = await TransactionPreference.find({ userId })
      .sort({ usageCount: -1, confidence: -1 })
      .limit(limit);
    return preferences;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    throw error;
  }
};

/**
 * Find similar preferences for a merchant/description
 * @param {string} userId - User ID
 * @param {string} searchTerm - Merchant or description to search for
 * @returns {Promise<Array>} - Matching preferences
 */
export const findSimilarPreferences = async (userId, searchTerm) => {
  try {
    const searchTermLower = searchTerm.toLowerCase();
    
    // Search in both originalMerchant and preferredDescription
    const preferences = await TransactionPreference.find({
      userId,
      $or: [
        { originalMerchant: { $regex: searchTermLower, $options: "i" } },
        { preferredDescription: { $regex: searchTermLower, $options: "i" } },
      ],
    })
      .sort({ confidence: -1, usageCount: -1 })
      .limit(5);
    
    return preferences;
  } catch (error) {
    console.error("Error finding similar preferences:", error);
    throw error;
  }
};

/**
 * Get preference examples for AI prompting (top preferences)
 * @param {string} userId - User ID
 * @param {number} limit - Number of examples to return
 * @returns {Promise<Array>} - Top preferences formatted as examples
 */
export const getPreferenceExamples = async (userId, limit = 5) => {
  try {
    const topPreferences = await TransactionPreference.find({ userId })
      .sort({ confidence: -1, usageCount: -1 })
      .limit(limit);

    // Format as AI examples
    const examples = topPreferences.map((pref) => ({
      merchant: pref.originalMerchant,
      description: pref.preferredDescription,
      category: pref.category,
      type: pref.type,
      tags: pref.customTags,
    }));

    return examples;
  } catch (error) {
    console.error("Error getting preference examples:", error);
    return []; // Return empty array if error
  }
};

/**
 * Delete a preference
 * @param {string} userId - User ID
 * @param {string} preferenceId - Preference ID to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteTransactionPreference = async (userId, preferenceId) => {
  try {
    const result = await TransactionPreference.findOneAndDelete({
      _id: preferenceId,
      userId,
    });
    return !!result;
  } catch (error) {
    console.error("Error deleting preference:", error);
    throw error;
  }
};

export default {
  saveTransactionPreference,
  getUserPreferences,
  findSimilarPreferences,
  getPreferenceExamples,
  deleteTransactionPreference,
};
