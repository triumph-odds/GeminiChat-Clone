import { Message } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs';
import * as path from 'path';

const MODEL_NAME = "gemini-1.5-pro";

// Try to read the API key directly from the .env file
let API_KEY = process.env.GOOGLE_API_KEY || "";

if (!API_KEY) {
  try {
    // Try to read directly from .env file
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/GOOGLE_API_KEY=([^\r\n]+)/);
      if (match && match[1]) {
        API_KEY = match[1].trim();
        console.log("API Key loaded from file directly");
      }
    }
  } catch (error) {
    console.error("Error reading .env file:", error);
  }
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generate an AI response using the Gemini API
 * @param prompt The user's prompt
 * @param history The conversation history for context
 * @returns A promise that resolves to the AI response
 */
export async function generateAiResponse(
  prompt: string,
  history: Message[] = []
): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    // Access the model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Format conversation history for the model
    const formattedHistory = history
      .filter(msg => msg.role === "user" || msg.role === "assistant")
      .map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // Create chat session
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    try {
      // Send message and get response
      const result = await chat.sendMessage(prompt);
      const response = result.response;
      const text = response.text();

      return text;
    } catch (unknownError) {
      console.error("API Request Error:", unknownError);
      
      // Convert to string for checking error messages
      const apiError = String(unknownError);
      
      // Check for API not enabled error
      if (apiError.includes("SERVICE_DISABLED") || 
          apiError.includes("API has not been used")) {
        throw new Error(
          "Google Generative AI API is not enabled for this API key. " +
          "Please visit the Google Cloud Console to enable the API for your project, " +
          "or provide a different API key that has the Generative AI API enabled."
        );
      }
      
      // Check for invalid API key
      if (apiError.includes("API key not valid") || 
          apiError.includes("INVALID_ARGUMENT")) {
        throw new Error(
          "The provided API key is invalid. Please check your API key and try again."
        );
      }
      
      // Re-throw the original error as an Error object
      if (unknownError instanceof Error) {
        throw unknownError;
      } else {
        throw new Error(String(unknownError));
      }
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while generating AI response");
    }
  }
}
