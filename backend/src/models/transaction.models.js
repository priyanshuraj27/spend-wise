import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
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
      required: true,
    },
    type: {
      type: String,
      enum: ["Need", "Want", "Investment", "Income", "Other"],
      required: true,
    },
    aiNote: {
      type: String,
      default: "",
    },
    transactionType: {
      type: String,
      enum: ["manual", "pdf-extracted"],
      default: "manual",
    },
    batchId: {
      type: String,
      default: null,
      index: true,
    },
    merchant: {
      type: String,
      default: "",
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Index for common queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, date: -1 });

export default mongoose.model("Transaction", transactionSchema);
