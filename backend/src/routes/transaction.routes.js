import { Router } from "express";
import {
  addTransaction,
  getTransactions,
  getAnalytics,
  deleteTransaction,
  updateTransaction,
  editClassification,
  deleteAllTransactions,
} from "../controllers/transaction.controllers.js";
import { uploadPDFStatement, getBatchTransactions } from "../controllers/pdf.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { fileUploadMiddleware } from "../middlewares/multer.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Transaction routes
router.post("/add", addTransaction);
router.get("/", getTransactions);
router.get("/analytics", getAnalytics);
router.put("/:id", updateTransaction);
router.put("/:id/edit-classification", editClassification);
router.delete("/:id", deleteTransaction);
router.delete("/", deleteAllTransactions);

// PDF upload routes
router.post("/upload-pdf", fileUploadMiddleware, uploadPDFStatement);
router.get("/batch/:batchId", getBatchTransactions);

export default router;
