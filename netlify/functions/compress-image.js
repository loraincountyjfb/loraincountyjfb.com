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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "TinyPNG API key not configured" }),
      };
    }

    tinify.key = apiKey;

    // Parse the request body
    const { imageData, filename } = JSON.parse(event.body);

    if (!imageData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "No image data provided" }),
      };
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(imageData.split(",")[1], "base64");

    // Compress the image
    const source = tinify.fromBuffer(buffer);
    const compressedBuffer = await source.toBuffer();

    // Convert back to base64
    const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;

    // Get compression stats
    const originalSize = buffer.length;
    const compressedSize = compressedBuffer.length;
    const compressionRatio = (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(1);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        compressedImage: compressedBase64,
        originalSize,
        compressedSize,
        compressionRatio: `${compressionRatio}%`,
        filename: filename || "compressed-image.jpg",
      }),
    };
  } catch (error) {
    console.error("Compression error:", error);

    let errorMessage = "Failed to compress image";
    let statusCode = 500;

    // Handle specific TinyPNG errors
    if (error.message.includes("AccountError")) {
      errorMessage = "TinyPNG API limit reached or invalid API key";
      statusCode = 429;
    } else if (error.message.includes("ClientError")) {
      errorMessage = "Invalid image format or corrupted image";
      statusCode = 400;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        error: errorMessage,
        details: error.message,
      }),
    };
  }
};
