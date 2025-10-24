import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import fs from "fs";

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text from PDF
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    
    // Convert Buffer to Uint8Array as required by pdfjs-dist
    const data = new Uint8Array(dataBuffer);
    
    // Use the correct function from pdfjs-dist
    const pdf = await pdfjsLib.default.getDocument(data).promise;

    let extractedText = "";

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      extractedText += pageText + "\n";
    }

    return extractedText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

/**
 * Clean and normalize extracted text
 * @param {string} text - Raw extracted text
 * @returns {string} - Cleaned text
 */
export const cleanExtractedText = (text) => {
  // Remove extra whitespace and normalize line breaks
  return text
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
};

/**
 * Parse transaction-like patterns from text
 * Looks for common patterns like: date, amount, description
 * @param {string} text - Cleaned text from PDF
 * @returns {Array} - Array of potential transaction lines
 */
export const extractTransactionPatterns = (text) => {
  const lines = text.split("\n");
  const transactionLines = [];

  // Pattern to match lines with dates, amounts, and descriptions
  // Looks for: DD/MM/YYYY or DD-MM-YYYY patterns with numbers (amounts)
  const dateAmountPattern =
    /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\s+(.+?)\s+([\d,]+\.?\d{0,2})\s*(?:Dr|Cr)?/i;

  for (const line of lines) {
    const match = line.match(dateAmountPattern);
    if (match) {
      transactionLines.push(line.trim());
    }
  }

  return transactionLines;
};

export default {
  extractTextFromPDF,
  cleanExtractedText,
  extractTransactionPatterns,
};
