import dotenv from "dotenv";

dotenv.config();

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ["application/pdf"],
};

export default config;
