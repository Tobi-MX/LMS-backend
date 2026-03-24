import ENV from "../config/env.js";

export const callGemini = async (prompt) => {
  const API_KEY = ENV.GEMINI_API_KEY;
  const MODEL = "gemini-3-flash-preview"; 
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();

    // Handle API errors (like invalid keys or rate limits)
    if (!res.ok) {
      console.error("Gemini API Error:", data.error?.message || "Unknown Error");
      throw new Error(data.error?.message || "Failed to fetch from Gemini");
    }

    // Safely extract text
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.warn("Gemini returned an empty response (possibly blocked by safety filters).");
      return "";
    }

    return text;
  } catch (error) {
    console.error("Error calling Gemini utility:", error);
    return "Error generating response.";
  }
};