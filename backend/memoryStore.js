/**
 * Simple in-memory project memory store
 * Can be replaced later with DB / vector store
 */

const projectMemory = {
  documents: [], // summaries + metadata
};

export function addToMemory(entry) {
  projectMemory.documents.push(entry);
}

export function getMemoryContext() {
  return projectMemory.documents
    .map(
      (doc, index) =>
        `Document ${index + 1}:\nSummary:\n${doc.summary}\nKey Points:\n${doc.keyPoints.join(
          ", "
        )}`
    )
    .join("\n\n");
}
