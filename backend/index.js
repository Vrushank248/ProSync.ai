import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import "dotenv/config";

import { getMemory, addToMemory, getMemoryContext } from "./memoryStore.js";
import { processWithAI, transcribeAudio } from "./aiProcessor.js";
import { generateSummaryPDF } from "./pdfExporter.js";
import { runOumiEvaluation } from "./oumi_eval/run_eval.js";

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

// ---------------- UPLOAD ENDPOINT ----------------

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    console.log("Uploaded:", req.file.originalname, mimeType);

    let extractedText = "";

    // ---------- PDF ----------
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

    // ---------- TEXT ----------
    else if (mimeType.startsWith("text/")) {
      extractedText = fs.readFileSync(filePath, "utf-8");
    }

    // ---------- AUDIO ----------
    else if (mimeType.startsWith("audio/")) {
      console.log("Transcribing audio...");
      extractedText = await transcribeAudio(filePath);
    }

    console.log("Extracted text length:", extractedText.length);

    // ---------- AI SUMMARY ----------
    const aiResult = await processWithAI(extractedText);

    // ---------- SAVE FOR OUMI ----------
    fs.writeFileSync(
      "oumi_eval/eval_artifacts/source.txt",
      extractedText,
      "utf-8"
    );
    fs.writeFileSync(
      "oumi_eval/eval_artifacts/summary.txt",
      aiResult.summary,
      "utf-8"
    );

    // ---------- RUN OUMI ----------
    const evalScores = await runOumiEvaluation();

    // ---------- MEMORY ----------
    addToMemory({
      fileName: req.file.originalname,
      summary: aiResult.summary,
      keyPoints: aiResult.keyPoints,
      evaluation: evalScores,
    });

    // ---------- RESPONSE ----------
    res.json({
      message: "File uploaded, summarized & evaluated",
      fileName: req.file.filename,
      fileType: mimeType,
      textLength: extractedText.length,
      summary: aiResult.summary,
      keyPoints: aiResult.keyPoints,
      evaluation: evalScores,
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "File processing failed",
      details: error.message,
    });
  }
});

// ---------------- CHAT ----------------

app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const context = getMemoryContext();

    const prompt = `
You are ProSync.ai.

Use ONLY the following project context.

${context}

Question:
${question}
`;

    const aiResult = await processWithAI(prompt);

    res.json({ answer: aiResult.summary });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chat failed" });
  }
});

// ---------------- EXPORT ----------------

app.get("/export", (req, res) => {
  try {
    const memory = getMemoryContext();

    if (!memory) {
      return res.status(400).json({
        error: "No project memory available to export",
      });
    }

    generateSummaryPDF(
      res,
      "Uploaded Documents & Meetings",
      memory,
      []
    );

    return;
  } catch (err) {
    console.error("Export error:", err);

    if (!res.headersSent) {
      res.status(500).json({ error: "Export failed" });
    }
  }
});

// ---------------- MEMORY ----------------

app.get("/memory", (req, res) => {
  res.json({ memory: getMemory() });
});

// ---------------- SERVER ----------------

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
