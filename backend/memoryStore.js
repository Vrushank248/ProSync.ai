/**
 * Simple in-memory project memory store
 */

const projectMemory = {
  documents: [],
};

export function addToMemory(entry) {
  projectMemory.documents.push(entry);
}

export function getMemoryContext() {
  return projectMemory.documents
    .map((doc, index) => {
      let block = `Document ${index + 1}:\nSummary:\n${doc.summary}\nKey Points:\n${doc.keyPoints.join(
        ", "
      )}`;

      if (doc.evaluation) {
        block += `\n\nEvaluation Metrics:
- Faithfulness: ${doc.evaluation.faithfulness}
- Relevance: ${doc.evaluation.relevance}
- Completeness: ${doc.evaluation.completeness}`;
      }

      return block;
    })
    .join("\n\n-------------------\n\n");
}

export function getMemory() {
  return projectMemory.documents;
}
