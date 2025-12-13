import Groq from "groq-sdk";
import fs from "fs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function processWithAI(text) {
  if (!text || !text.trim()) {
    return {
      summary: "",
      keyPoints: [],
    };
  }

  const prompt = `
You are an intelligent project assistant.

Tasks:
1) Produce a concise, clear summary.
2) List 5–7 key points or decisions as bullet points.

Content:
${text.slice(0, 12000)}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You summarize project information." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content || "";

  const lines = content.split("\n").map(l => l.trim());
  const keyPoints = lines
    .filter(l => l.startsWith("-") || l.startsWith("•"))
    .map(l => l.replace(/^[-•]\s*/, ""));

  return {
    summary: content,
    keyPoints,
  };
}

export async function transcribeAudio(filePath) {
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-large-v3",
  });

  return transcription.text || "";
}
