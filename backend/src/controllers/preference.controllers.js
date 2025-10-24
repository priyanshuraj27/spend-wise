import {
  saveTransactionPreference,
  getUserPreferences,
  findSimilarPreferences,
  deleteTransactionPreference,
} from "../services/preference.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Save or update a transaction preference
 * POST /api/preferences/save
 * Body: { originalMerchant, preferredDescription, category, type, customTags: [] }
 */
export const savePreference = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { originalMerchant, preferredDescription, category, type, customTags = [] } = req.body;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!originalMerchant?.trim() || !preferredDescription?.trim()) {
    throw new ApiError(400, "Merchant name and preferred description are required");
  }

  try {
    const preference = await saveTransactionPreference(
      userId,
      originalMerchant.trim(),
      preferredDescription.trim(),
      category?.trim() || "Other",
      type?.trim() || "Expense",
      customTags || []
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          preference,
          "Preference saved successfully! We'll use this for similar transactions."
        )
      );
  } catch (error) {
    console.error("Error saving preference:", error);
    throw new ApiError(500, "Failed to save preference");
  }
});

/**
 * Get all preferences for authenticated user
 * GET /api/preferences
 */
export const getUserPrefs = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const preferences = await getUserPreferences(userId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          preferences,
          `Found ${preferences.length} saved preferences`
        )
      );
  } catch (error) {
    console.error("Error fetching preferences:", error);
    throw new ApiError(500, "Failed to fetch preferences");
  }
});

/**
 * Find preferences similar to a search term
 * GET /api/preferences/search?term=amazon
 */
export const searchPreferences = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { term } = req.query;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!term?.trim()) {
    throw new ApiError(400, "Search term is required");
  }

  try {
    const preferences = await findSimilarPreferences(userId, term.trim());

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          preferences,
          `Found ${preferences.length} matching preferences`
        )
      );
  } catch (error) {
    console.error("Error searching preferences:", error);
    throw new ApiError(500, "Failed to search preferences");
  }
});

/**
 * Delete a specific preference
 * DELETE /api/preferences/:id
 */
export const deletePreference = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!id?.trim()) {
    throw new ApiError(400, "Preference ID is required");
  }

  try {
    const result = await deleteTransactionPreference(userId, id);

    if (!result) {
      throw new ApiError(404, "Preference not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, {}, "Preference deleted successfully"));
  } catch (error) {
    console.error("Error deleting preference:", error);
    if (error.statusCode === 404) throw error;
    throw new ApiError(500, "Failed to delete preference");
  }
});
