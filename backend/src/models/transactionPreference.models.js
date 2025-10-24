import mongoose from "mongoose";

const transactionPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Original merchant/description from PDF
    originalMerchant: {
      type: String,
      required: true,
    },
    // User's preferred description
    preferredDescription: {
      type: String,
      required: true,
    },
    // User's preferred category
    category: {
      type: String,
      enum: [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Entertainment",
        "Healthcare",
        "Education",
        "Investment",
        "Salary",
        "Other",
      ],
    },
    // User's preferred type
    type: {
      type: String,
      enum: ["Need", "Want", "Investment", "Income", "Other"],
    },
    // Custom tags user added
    customTags: [
      {
        type: String,
      },
    ],
    // How many times this preference has been used
    usageCount: {
      type: Number,
      default: 1,
    },
    // Confidence score (increases with more usage)
    confidence: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionPreferenceSchema.index({ userId: 1, originalMerchant: 1 });
transactionPreferenceSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("TransactionPreference", transactionPreferenceSchema);
