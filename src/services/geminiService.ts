import { GoogleGenAI } from "@google/genai";
import { PaperConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export const generateQuestionPaper = async (
  config: PaperConfig,
  userPrompt: string,
  currentPaperContent: string
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const systemInstruction = `
      You are an expert academic assistant designed to create professional question papers.
      
      Current Context:
      - Class/Grade: ${config.grade}
      - Subject: ${config.subject}
      
      Your goal is to generate or modify a question paper based on the user's request.
      
      Rules:
      1. Output ONLY the content of the question paper in clean Markdown format.
      2. Do not include conversational filler in the output (e.g., "Here is your paper").
      3. Use clear headings (# Section A, ## Question 1).
      4. If the user asks to "add" to the existing paper, merge the new questions logically.
      5. Ensure appropriate difficulty for the specified Grade.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: `Current Paper Content (if any):\n${currentPaperContent}` }] },
        { role: 'user', parts: [{ text: `User Request: ${userPrompt}` }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || '';
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
};

export const generateChatResponse = async (
  userPrompt: string
): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: userPrompt,
            config: {
                systemInstruction: "You are a helpful assistant guiding a user through creating a question paper. Keep responses short and encouraging."
            }
        });
        return response.text || "I processed that.";
    } catch (error) {
        return "Sorry, I'm having trouble connecting right now.";
    }
}
