export interface CompressionResult {
  success: boolean;
  compressedImage?: string;
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: string;
  filename?: string;
  error?: string;
}

export interface CompressionProgress {
  stage: 'reading' | 'uploading' | 'compressing' | 'complete' | 'error';
  message: string;
  progress?: number;
}

/**
 * Converts a File object to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts base64 string to File object
 */
function base64ToFile(base64: string, filename: string, mimeType: string = 'image/jpeg'): File {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: mimeType });
}

/**
 * Compresses an image using TinyPNG API via Netlify function
 */
export async function compressImage(
  file: File,
  onProgress?: (progress: CompressionProgress) => void
): Promise<CompressionResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Check file size (max 500MB as per TinyPNG limits)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 500MB limit');
    }

    onProgress?.({
      stage: 'reading',
      message: 'Reading image file...',
      progress: 10
    });

    // Convert file to base64
    const base64Data = await fileToBase64(file);

    onProgress?.({
      stage: 'uploading',
      message: 'Uploading to compression service...',
      progress: 30
    });

    // Send to Netlify function for compression
    const response = await fetch('/.netlify/functions/compress-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: base64Data,
        filename: file.name
      })
    });

    onProgress?.({
      stage: 'compressing',
      message: 'Compressing image...',
      progress: 70
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Compression failed');
    }

    onProgress?.({
      stage: 'complete',
      message: 'Compression complete!',
      progress: 100
    });

    return result;

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
export function createCompressedFile(result: CompressionResult, originalFile: File): File | null {
  if (!result.success || !result.compressedImage) {
    return null;
  }

  const filename = result.filename || originalFile.name.replace(/\.[^/.]+$/, '_compressed.jpg');
  return base64ToFile(result.compressedImage, filename);
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates if compression should be applied based on file size
 */
export function shouldCompress(file: File, maxSizeKB: number = 1024): boolean {
  return file.size > (maxSizeKB * 1024);
} 