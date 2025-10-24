import React, { useRef, useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';

const PDFUpload = () => {
  const { uploadPDF, loading, error } = useTransactions();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      setUploadSuccess(false);
      setUploadError(null);
      console.log('Starting PDF upload:', file.name, file.size);
      const result = await uploadPDF(file);
      console.log('Upload result:', result);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('PDF upload error:', error);
      setUploadError(error.message || 'Failed to upload PDF. Please try again.');
      setTimeout(() => setUploadError(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Upload Bank Statement</h1>
          <p className="text-gray-600 mt-2">
            Upload your PDF bank statement and we'll automatically extract and classify transactions
          </p>
        </div>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="mb-8 bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">✓</span>
            <div>
              <p className="font-semibold">Upload Successful!</p>
              <p className="text-sm">Your transactions have been extracted and classified with AI.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {(uploadError || error) && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">✗</span>
            <div>
              <p className="font-semibold">Upload Failed</p>
              <p className="text-sm">{uploadError || error}</p>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleChange}
              className="hidden"
            />

            <div onClick={() => fileInputRef.current?.click()} className="space-y-4">
              <div className="text-5xl">📄</div>
              <div>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Drop your PDF here
                </p>
                <p className="text-gray-600">
                  or{' '}
                  <span className="text-blue-600 font-semibold hover:underline">
                    click to browse
                  </span>
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Supported: PDF files up to 10MB
              </p>
            </div>
          </div>

          {/* Supported Banks Info */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-3">📱 Supported Banks</h3>
            <p className="text-gray-700 text-sm mb-3">
              SpendWise works with bank statements from most Indian banks. Currently tested with:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'Google Pay', 'PayTM', 'PhonePe'].map(
                (bank) => (
                  <div key={bank} className="bg-white rounded px-3 py-2 text-sm text-gray-700">
                    ✓ {bank}
                  </div>
                )
              )}
            </div>
          </div>

          {/* How it works */}
          <div className="mt-8 bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-semibold text-gray-800 mb-3">🤖 How It Works</h3>
            <ol className="text-gray-700 text-sm space-y-2">
              <li>1. Upload your PDF bank statement</li>
              <li>2. Our system extracts transactions automatically</li>
              <li>3. AI classifies each transaction by category (Food, Travel, etc.)</li>
              <li>4. Each transaction is marked as Need, Want, or Investment</li>
              <li>5. View and manage all transactions in your dashboard</li>
            </ol>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 bg-blue-100 border border-blue-300 text-blue-800 px-4 py-4 rounded-lg flex items-center">
            <span className="inline-block animate-spin mr-3">⌛</span>
            Processing your PDF... This may take a moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUpload;
