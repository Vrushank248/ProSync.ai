import PDFDocument from "pdfkit";

export function generateSummaryPDF(res, title, summary, keyPoints) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="ProSync_Summary.pdf"`
  );

  doc.pipe(res);

  // Title
  doc.fontSize(20).text("ProSync.ai — Project Summary", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Source: ${title}`);
  doc.moveDown();

  // Summary
  doc.fontSize(16).text("Summary");
  doc.moveDown(0.5);
  doc.fontSize(11).text(summary);
  doc.moveDown();

  // Key Points
  doc.fontSize(16).text("Key Points");
  doc.moveDown(0.5);
  keyPoints.forEach((point, i) => {
    doc.fontSize(11).text(`${i + 1}. ${point}`);
  });

  doc.end();
}
