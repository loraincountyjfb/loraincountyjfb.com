# TinyPNG Image Compression Setup

This project now includes automatic image compression using the TinyPNG API for all photo uploads in forms. When users upload photos, they are automatically compressed before being submitted to reduce file sizes and improve performance.

## Features

- **Automatic Compression**: Photos are compressed using TinyPNG API before form submission
- **Progress Indicators**: Users see real-time progress during compression
- **Submit Button Control**: Form submission is disabled during compression to prevent premature submission
- **Error Handling**: Graceful fallback if compression fails
- **Size Validation**: Maximum 5MB file size limit
- **Compression Stats**: Shows users how much space was saved

## Setup Instructions

### 1. Get TinyPNG API Key

1. Visit [TinyPNG Developer API](https://tinypng.com/developers)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free accounts get 500 compressions per month

### 2. Configure Environment Variables

Add your TinyPNG API key to your Netlify environment variables:

#### Option A: Netlify Dashboard
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add a new variable:
   - **Key**: `TINYPNG_API_KEY`
   - **Value**: Your TinyPNG API key

#### Option B: Local Development
Create a `.env` file in your project root:
```bash
TINYPNG_API_KEY=your_api_key_here
```

### 3. Install Dependencies

The required dependencies are already configured:

```bash
# In netlify/functions directory
cd netlify/functions
npm install
```

**Important**: The project includes a `netlify.toml` configuration file with the `@netlify/plugin-functions-install-core` plugin. This automatically installs function dependencies during Netlify's build process, resolving any "tinify dependency not found" errors.

### 4. Deploy

Deploy your site to Netlify. The functions will be automatically deployed with their dependencies installed.

## How It Works

### User Experience
1. User selects an image file in any form
2. File is validated (max 5MB, image types only)
3. **Submit button is disabled** with "COMPRESSING IMAGE..." text and spinner
4. Compression progress is shown with a progress bar
5. Compressed image replaces the original
6. **Submit button is re-enabled** once compression completes
7. Form submits with the smaller, compressed image
8. User sees compression statistics (e.g., "Reduced from 2.1 MB to 890 KB (57% savings)")

### Technical Flow
1. **Client-side**: Image is converted to base64
2. **Netlify Function**: Receives image data and sends to TinyPNG API
3. **TinyPNG**: Compresses the image and returns optimized version
4. **Client-side**: Receives compressed image and replaces original file
5. **Form Submission**: Netlify Forms receives the compressed image

## Files Modified/Added

### New Files
- `netlify/functions/compress-image.js` - Netlify function for image compression
- `netlify/functions/package.json` - Dependencies for functions
- `src/lib/imageCompression.ts` - TypeScript utilities (for reference)

### Modified Files
- `src/components/PigForm.astro` - Added compression functionality to pig form

## Testing

### Test the Compression Function
1. Upload an image larger than 1MB to the pig form
2. Watch the progress indicator
3. Verify the compression statistics are displayed
4. Check that the form submits successfully

### Verify Function Deployment
Visit: `https://your-site.netlify.app/.netlify/functions/compress-image`
You should see a "Method not allowed" error (this is expected for GET requests)

## Error Handling

The system handles various error scenarios:

- **No API Key**: Shows server configuration error
- **Invalid API Key**: Shows credential error
- **Rate Limit Exceeded**: Shows rate limit message
- **File Too Large**: Shows file size error
- **Network Issues**: Falls back to original file
- **Compression Failure**: Uses original file and shows error

## API Limits

### TinyPNG Free Tier
- 500 compressions per month
- 5MB maximum file size
- PNG and JPEG support

### Upgrading
For higher usage, upgrade your TinyPNG plan at [tinypng.com/developers](https://tinypng.com/developers)

## Troubleshooting

### Function Dependencies Not Installing
If you see errors like "tinify dependency not found" during Netlify deployment:

1. **Check netlify.toml**: Ensure the `netlify.toml` file exists in your project root with:
   ```toml
   [[plugins]]
   package = "@netlify/plugin-functions-install-core"
   ```

2. **Alternative Solutions**:
   - **Option A**: Move tinify to main package.json:
     ```bash
     npm install tinify
     ```
   - **Option B**: Add to build command in netlify.toml:
     ```toml
     [build]
     command = "npm run build && cd netlify/functions && npm install"
     ```

### Function Not Working
1. Check Netlify function logs in dashboard
2. Verify `TINYPNG_API_KEY` environment variable is set
3. Ensure API key is valid and has remaining quota

### Compression Not Happening
1. Check browser console for errors
2. Verify file is under 5MB
3. Ensure file is a valid image format (PNG, JPEG)

### Form Submission Issues
1. Compression failure falls back to original file
2. Form should still submit successfully
3. Check Netlify Forms submissions in dashboard

## Performance Notes

- Compression typically takes 2-5 seconds depending on file size
- Users see progress feedback during compression
- Original file is used if compression fails
- No impact on form submission if compression is disabled

## Security

- API key is stored securely in Netlify environment variables
- Images are processed server-side through Netlify functions
- No client-side API key exposure
- CORS headers properly configured for security 