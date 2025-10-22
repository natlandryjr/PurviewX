

import { GoogleGenAI } from "@google/genai";

// FIX: Aligned with Gemini API guidelines. The API key is obtained exclusively from process.env.API_KEY
// and is assumed to be always available, so conditional checks are removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiExplanation = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert in Microsoft Purview and compliance. Explain the following concept clearly and concisely for an IT administrator. Use simple terms and focus on the practical impact.",
        temperature: 0.5,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't get an explanation at this time. Please try again later.";
  }
};
