const tinify = require("tinify");

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Get TinyPNG API key from environment variables
    const apiKey = process.env.TINYPNG_API_KEY;

    if (!apiKey) {
      console.error("TinyPNG API key not found in environment variables");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Server configuration error: TinyPNG API key not found",
        }),
      };
    }

    // Set the API key
    tinify.key = apiKey;

    // Parse the request body
    const { imageData, filename, mimeType } = JSON.parse(event.body);

    if (!imageData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "No image data provided" }),
      };
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageData, "base64");

    // Validate file size (max 5MB for TinyPNG)
    if (imageBuffer.length > 5 * 1024 * 1024) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Image too large. Maximum size is 5MB.",
        }),
      };
    }

    console.log(
      `Compressing image: ${filename}, original size: ${imageBuffer.length} bytes`
    );

    // Compress the image using TinyPNG
    const compressedBuffer = await tinify.fromBuffer(imageBuffer).toBuffer();

    // Convert compressed buffer back to base64
    const compressedBase64 = compressedBuffer.toString("base64");

    const originalSize = imageBuffer.length;
    const compressedSize = compressedBuffer.length;
    const compressionRatio = (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(1);

    console.log(
      `Compression complete: ${filename}, compressed size: ${compressedSize} bytes, saved: ${compressionRatio}%`
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        compressedImage: compressedBase64,
        originalSize,
        compressedSize,
        compressionRatio: parseFloat(compressionRatio),
        filename,
        mimeType,
      }),
    };
  } catch (error) {
    console.error("Error compressing image:", error);

    // Handle specific TinyPNG errors
    if (error.message && error.message.includes("Credentials are invalid")) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Invalid TinyPNG API credentials",
        }),
      };
    }

    if (error.message && error.message.includes("Too many requests")) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          error: "TinyPNG API rate limit exceeded. Please try again later.",
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to compress image. Please try again.",
      }),
    };
  }
};
