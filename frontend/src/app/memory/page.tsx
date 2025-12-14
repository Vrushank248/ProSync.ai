"use client";

import { useEffect, useState } from "react";

type Doc = {
  fileName: string;
  summary: string;
  keyPoints: string[];
  evaluation?: {
    faithfulness: number;
    relevance: number;
    completeness: number;
  };
};

export default function MemoryPage() {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/memory")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.memory)) {
          setDocs(data.memory);
        }
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Project Memory</h2>
      <p className="text-gray-600 mb-6">
        Summaries, key points, and AI quality metrics.
      </p>

      <a
        href="http://localhost:5000/export"
        className="inline-block mb-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Export Summary PDF
      </a>

      {docs.length === 0 && (
        <p className="text-sm text-gray-500">
          No project memory yet.
        </p>
      )}

      <div className="space-y-6">
        {docs.map((doc, i) => (
          <div key={i} className="border rounded-lg p-5 bg-white">
            <h3 className="font-semibold mb-2">
              {doc.fileName}
            </h3>

            <p className="text-sm mb-3 whitespace-pre-wrap">
              {doc.summary}
            </p>

            <ul className="text-sm list-disc ml-5 mb-3">
              {doc.keyPoints.map((kp, idx) => (
                <li key={idx}>{kp}</li>
              ))}
            </ul>

            {doc.evaluation && (
              <div className="mt-3 text-sm bg-gray-50 p-3 rounded">
                <strong>OUMI Evaluation</strong>
                <div>Faithfulness: {doc.evaluation.faithfulness}</div>
                <div>Relevance: {doc.evaluation.relevance}</div>
                <div>Completeness: {doc.evaluation.completeness}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
