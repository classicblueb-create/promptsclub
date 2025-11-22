import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const refineDescription = async (rawText: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `You are a helpful assistant for a prompt engineering service called "Prompt Club". 
    A user has written a rough request for an AI prompt they want. 
    Your job is to rewrite their request to be clearer, more detailed, and structured so our prompt engineers can understand it better.
    
    User's rough text: "${rawText}"
    
    Output ONLY the refined description text. Keep it polite and professional but concise.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || rawText;
  } catch (error) {
    console.error("Error refining description:", error);
    return rawText; // Fallback to original text on error
  }
};
