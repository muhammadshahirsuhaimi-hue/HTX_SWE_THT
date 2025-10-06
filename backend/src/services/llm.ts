import axios from "axios";

interface GeminiCandidate {
  content: any; // could be string, array, or { parts: [{ text }] }
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

export async function getSkillsFromTitle(title: string): Promise<string[]> {
  try {
    const response = await axios.post<GeminiResponse>(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `Given this task: "${title}", return the required skills (Frontend, Backend, or both) as a JSON array.`
              }
            ]
          }
        ]
      },
      {
        headers: {
          "x-goog-api-key": process.env.LLM_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const candidate = response.data.candidates?.[0];
    if (!candidate) return [];

    let text = "";

    if (Array.isArray(candidate.content)) {
      // Array of strings or objects
      text = candidate.content
        .map((c: any) =>
          typeof c === "string" ? c : c.text ? c.text : JSON.stringify(c)
        )
        .join(" ");
    } else if (typeof candidate.content === "string") {
      text = candidate.content;
    } else if (candidate.content.parts && Array.isArray(candidate.content.parts)) {
      // Handle Gemini returning { parts: [{ text }] }
      text = candidate.content.parts.map((p: any) => p.text).join(" ");
    } else {
      console.warn("Unknown content format from Gemini:", candidate.content);
      return [];
    }

    // Remove ```json ... ``` fences
    text = text.replace(/```json\s*([\s\S]*?)```/i, "$1").trim();

    // Parse JSON safely
    try {
      const skills = JSON.parse(text);
      if (Array.isArray(skills)) return skills;
    } catch {
      console.warn("Failed to parse LLM response as JSON:", text);
    }

    return [];
  } catch (err: any) {
    console.warn("LLM skill extraction failed:", err.response?.status || err.code || err.message);
    return [];
  }
}
