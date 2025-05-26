# TinyPNG Image Compression Setup

This project now includes automatic image compression using the TinyPNG API. Images larger than 1MB uploaded through forms will be automatically compressed before submission.

## Setup Instructions

### 1. Get a TinyPNG API Key

1. Visit [TinyPNG Developers](https://tinypng.com/developers)
2. Sign up with your name and email address
3. You'll receive 500 free compressions per month
4. Copy your API key from the dashboard

### 2. Configure Environment Variables

Add your TinyPNG API key to your environment variables:

**For Netlify deployment:**
1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add a new variable:
   - Key: `TINYPNG_API_KEY`
   - Value: Your TinyPNG API key

**For local development:**
Create a `.env` file in your project root:
```
TINYPNG_API_KEY=your_tinypng_api_key_here
```

### 3. Install Dependencies

The Netlify function requires the `tinify` package. This is automatically installed when the function is deployed.

## How It Works

1. **Automatic Detection**: When a user selects an image file larger than 1MB, the compression process starts automatically
2. **Progress Feedback**: Users see real-time progress updates during compression
3. **Seamless Integration**: The compressed image replaces the original file in the form input
4. **Error Handling**: If compression fails, users see helpful error messages and can retry
5. **Fallback**: If the TinyPNG service is unavailable, the original file is used

## Features

- ✅ Automatic compression for images > 1MB
- ✅ Real-time progress indicators
- ✅ Compression statistics (original size → compressed size)
- ✅ Error handling with user-friendly messages
- ✅ Supports JPEG, PNG, WebP, and AVIF formats
- ✅ Maintains image quality while reducing file size
- ✅ Works with Netlify Forms

## File Structure

```
netlify/
  functions/
    compress-image.js     # Netlify function for server-side compression
    package.json          # Dependencies for the function
src/
  lib/
    imageCompression.ts   # Client-side compression utilities
  components/
    ImageCompressor.tsx   # Reusable React component (optional)
    PigForm.astro        # Updated form with compression
```

## Usage in Other Forms

To add compression to other forms, you can either:

1. **Use the existing pattern**: Copy the compression logic from `PigForm.astro`
2. **Use the React component**: Import and use `ImageCompressor.tsx` for React-based forms
3. **Use the utilities**: Import functions from `imageCompression.ts` for custom implementations

## API Limits

- **Free tier**: 500 compressions per month
- **File size limit**: 500MB maximum
- **Supported formats**: JPEG, PNG, WebP, AVIF
- **Compression ratio**: Typically 60-80% size reduction

## Troubleshooting

### "TinyPNG API key not configured" error
- Ensure the `TINYPNG_API_KEY` environment variable is set correctly
- Check that the API key is valid and not expired

### "API limit reached" error
- You've exceeded your monthly compression limit
- Consider upgrading your TinyPNG plan or wait until next month

### Compression fails
- Check your internet connection
- Verify the image file is not corrupted
- Ensure the file format is supported

### Function not found error
- Make sure the Netlify function is deployed correctly
- Check that the function path `/.netlify/functions/compress-image` is accessible

## Security Notes

- API keys are stored securely as environment variables
- Image data is transmitted securely over HTTPS
- No image data is stored permanently on TinyPNG servers
- Compressed images are processed in memory and returned immediately 