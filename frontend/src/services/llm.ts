import axios from "axios";

export async function getSkillsFromTitle(title: string): Promise<string[]> {
  const response = await axios.post("https://api.gemini.com/v1/generate", {
    prompt: `Given this task: "${title}", return the required skills (Frontend, Backend, or both) as a JSON array.`,
  }, {
    headers: { "Authorization": `Bearer ${process.env.LLM_KEY}` }
  });

  return response.data.skills || [];
}
