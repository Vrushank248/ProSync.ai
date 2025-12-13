"use client";

import { useState } from "react";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askQuestion() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer || "No answer returned.");
    } catch (err) {
      setAnswer("Error contacting ProSync backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Ask ProSync</h2>
      <p className="text-gray-600 mb-6">
        Ask questions about your project using uploaded meetings and documents.
      </p>

      <div className="border rounded-lg p-6 bg-white space-y-4">
        {/* Question Input */}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your project..."
          className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        {/* Ask Button */}
        <button
          onClick={askQuestion}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>

        {/* Answer */}
        {answer && (
          <div className="mt-4 p-4 bg-gray-50 border rounded-md">
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
