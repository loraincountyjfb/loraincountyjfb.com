import React, { useState, useRef } from 'react';
import { 
  compressImage, 
  createCompressedFile, 
  formatFileSize, 
  shouldCompress,
  type CompressionResult,
  type CompressionProgress 
} from '../lib/imageCompression';

interface ImageCompressorProps {
  onFileSelect: (file: File) => void;
  maxSizeKB?: number;
  accept?: string;
  className?: string;
  children?: React.ReactNode;
  autoCompress?: boolean;
}

export default function ImageCompressor({
  onFileSelect,
  maxSizeKB = 1024,
  accept = "image/*",
  className = "",
  children,
  autoCompress = true
}: ImageCompressorProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<CompressionProgress | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setCompressionResult(null);

    // Check if compression is needed
    if (!shouldCompress(file, maxSizeKB)) {
      // File is already small enough, use as-is
      onFileSelect(file);
      return;
    }

    if (!autoCompress) {
      // Let parent component handle compression decision
      onFileSelect(file);
      return;
    }

    // Auto-compress the image
    await compressFile(file);
  };

  const compressFile = async (file: File) => {
    setIsCompressing(true);
    setProgress(null);

    try {
      const result = await compressImage(file, (progressUpdate) => {
        setProgress(progressUpdate);
      });

      setCompressionResult(result);

      if (result.success) {
        const compressedFile = createCompressedFile(result, file);
        if (compressedFile) {
          onFileSelect(compressedFile);
        } else {
          setError('Failed to create compressed file');
        }
      } else {
        setError(result.error || 'Compression failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsCompressing(false);
      setProgress(null);
    }
  };

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
    setCompressionResult(null);
    setProgress(null);
  };

  return (
    <div className={className}>
      {children || (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isCompressing}
            className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-gray-700 hover:file:bg-gray-100 disabled:opacity-50"
          />
        </div>
      )}

      {/* Progress indicator */}
      {isCompressing && progress && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              {progress.message}
            </span>
            {progress.progress && (
              <span className="text-sm text-blue-700">
                {progress.progress}%
              </span>
            )}
          </div>
          {progress.progress && (
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Success message */}
      {compressionResult?.success && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-green-900">Image compressed successfully!</p>
              <p className="text-green-700">
                Reduced by {compressionResult.compressionRatio} 
                ({formatFileSize(compressionResult.originalSize || 0)} → {formatFileSize(compressionResult.compressedSize || 0)})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-red-900">Compression failed</p>
              <p className="text-red-700">{error}</p>
              <button
                onClick={resetInput}
                className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File size warning */}
      {!autoCompress && (
        <p className="mt-2 text-sm text-gray-600">
          Files larger than {formatFileSize(maxSizeKB * 1024)} will be automatically compressed.
        </p>
      )}
    </div>
  );
} 