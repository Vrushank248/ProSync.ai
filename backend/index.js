import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import "dotenv/config";
import { addToMemory, getMemoryContext } from "./memoryStore.js";
import { processWithAI, transcribeAudio } from "./aiProcessor.js";


const app = express();

app.use(cors());
app.use(express.json());

// ---------------- FILE STORAGE ----------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ---------------- HEALTH CHECK ----------------

app.get("/", (req, res) => {
  res.json({ status: "ProSync backend running" });
});

// ---------------- UPLOAD ENDPOINT (STEP 9 + STEP 10) ----------------

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    console.log("Uploaded:", req.file.originalname, mimeType);

    let extractedText = "";

    // ---------- PDF TEXT EXTRACTION (STEP 9) ----------
    if (mimeType === "application/pdf") {
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

      const data = new Uint8Array(fs.readFileSync(filePath));
      const pdf = await pdfjsLib.getDocument({ data }).promise;

      let text = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + "\n";
      }

      extractedText = text;
    }

    // ---------- TXT EXTRACTION ----------
    else if (mimeType.startsWith("text/")) {
      extractedText = fs.readFileSync(filePath, "utf-8");
    }

    // ---------- AUDIO TRANSCRIPTION ----------
    else if (mimeType.startsWith("audio/")) {
      console.log("Transcribing audio...");
      extractedText = await transcribeAudio(filePath);
    }

    console.log("Extracted text length:", extractedText.length);

    // ---------- AI SUMMARIZATION (STEP 10) ----------
    const aiResult = await processWithAI(extractedText);
    addToMemory({
      fileName: req.file.originalname,
      summary: aiResult.summary,
      keyPoints: aiResult.keyPoints,
    });
    res.json({
      message: "File uploaded, text extracted & summarized",
      fileName: req.file.filename,
      fileType: mimeType,
      textLength: extractedText.length,
      summary: aiResult.summary,
      keyPoints: aiResult.keyPoints,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "File processing failed",
      details: error.message,
    });
  }
});

// Chat
app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const context = getMemoryContext();

    const prompt = `
You are ProSync.ai, a project-aware assistant.

Use ONLY the following project context to answer.

Project Context:
${context}

User Question:
${question}
`;

    const aiResult = await processWithAI(prompt);

    res.json({
      answer: aiResult.summary,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chat failed" });
  }
});

// memory

app.get("/memory", (req, res) => {
  res.json({
    memory: getMemoryContext(),
  });
});

// ---------------- SERVER ----------------

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
