export interface CompressionResult {
  success: boolean;
  compressedImage?: string;
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
  filename?: string;
  mimeType?: string;
  error?: string;
}

export interface CompressionProgress {
  stage: 'reading' | 'uploading' | 'compressing' | 'complete' | 'error';
  message: string;
}

/**
 * Converts a File object to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Creates a File object from base64 data
 */
function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  
  return new File([blob], filename, { type: mimeType });
}

/**
 * Compresses an image file using TinyPNG API via Netlify function
 */
export async function compressImage(
  file: File,
  onProgress?: (progress: CompressionProgress) => void
): Promise<CompressionResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB for TinyPNG)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image too large. Maximum size is 5MB.');
    }

    onProgress?.({
      stage: 'reading',
      message: 'Reading image file...'
    });

    // Convert file to base64
    const base64Data = await fileToBase64(file);

    onProgress?.({
      stage: 'uploading',
      message: 'Uploading to compression service...'
    });

    // Send to Netlify function for compression
    const response = await fetch('/.netlify/functions/compress-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: base64Data,
        filename: file.name,
        mimeType: file.type
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    onProgress?.({
      stage: 'compressing',
      message: 'Compressing image...'
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Compression failed');
    }

    onProgress?.({
      stage: 'complete',
      message: `Compression complete! Saved ${result.compressionRatio}%`
    });

    return {
      success: true,
      compressedImage: result.compressedImage,
      originalSize: result.originalSize,
      compressedSize: result.compressedSize,
      compressionRatio: result.compressionRatio,
      filename: result.filename,
      mimeType: result.mimeType
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    onProgress?.({
      stage: 'error',
      message: errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Creates a compressed File object from compression result
 */
export function createCompressedFile(result: CompressionResult): File | null {
  if (!result.success || !result.compressedImage || !result.filename || !result.mimeType) {
    return null;
  }

  return base64ToFile(result.compressedImage, result.filename, result.mimeType);
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 