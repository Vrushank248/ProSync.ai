import PDFDocument from "pdfkit";

export function generateSummaryPDF(res, title, summary, keyPoints = []) {
  const doc = new PDFDocument({ margin: 50 });

  // ---------- HEADERS ----------
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="ProSync_Summary.pdf"`
  );

  // Stream PDF to response
  doc.pipe(res);

  // ---------- TITLE ----------
  doc.fontSize(20).text("ProSync.ai — Project Summary", { align: "center" });
  doc.moveDown(1.5);

  doc.fontSize(14).text(`Source: ${title}`);
  doc.moveDown();

  // ---------- SUMMARY ----------
  doc.fontSize(16).text("Summary");
  doc.moveDown(0.5);
  doc.fontSize(11).text(summary || "No summary available.");
  doc.moveDown();

  // ---------- KEY POINTS ----------
  if (Array.isArray(keyPoints) && keyPoints.length > 0) {
    doc.fontSize(16).text("Key Points");
    doc.moveDown(0.5);

    keyPoints.forEach((point, index) => {
      doc.fontSize(11).text(`${index + 1}. ${point}`);
    });

    doc.moveDown();
  }

  // ---------- FINALIZE ----------
  doc.end();
}
