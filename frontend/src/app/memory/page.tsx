"use client";

import { useEffect, useState } from "react";

export default function MemoryPage() {
  const [memory, setMemory] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/memory")
      .then(res => res.json())
      .then(data => setMemory(data.memory || ""));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Project Memory</h2>
      <p className="text-gray-600 mb-6">
        Everything ProSync.ai currently knows about your project.
      </p>
      <a
        href="http://localhost:5000/export"
        className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Export Summary PDF
      </a>
      <div className="border rounded-lg p-6 bg-white">
        {memory ? (
          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {memory}
          </pre>
        ) : (
          <p className="text-sm text-gray-500">
            No project memory yet. Upload documents or meetings.
          </p>
        )}
      </div>
    </div>
  );
}
