import fileUpload from 'express-fileupload';

/**
 * Express file upload middleware for handling PDF uploads
 * Supports multipart form data
 */
export const fileUploadMiddleware = fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  abortOnLimit: false,
  useTempFiles: true,
  tempFileDir: './public/temp/',
  createParentPath: true,
  safeFileNames: true,
  preserveExtension: true,
  parseNested: false,
});