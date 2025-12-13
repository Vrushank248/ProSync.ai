"use client";

import { useRef, useState, useEffect } from "react";

export default function UploadPage() {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [backendStatus, setBackendStatus] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadFile = async (file: File) => {
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "Upload completed");
    } catch (err) {
      setMessage("Upload failed");
    } finally {
      setUploading(false);
    }
  };



  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus("Backend not reachable"));
  }, []);




  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Upload Project Data
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Add meeting recordings or documents. ProSync builds a shared,
          searchable project memory your team can rely on.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Meeting Audio */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-lg">
                🎙️
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Meeting Audio
              </h3>
            </div>

            <p className="text-sm text-gray-600">
              Upload recorded meetings (MP3, WAV). ProSync will transcribe,
              summarize, and extract key decisions automatically.
            </p>

            <div
              onClick={() => audioInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-slate-50 hover:border-blue-500 transition-colors"
            >
              <p className="text-sm font-medium text-gray-700">
                {audioFile ? audioFile.name : "Drag & drop audio file"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse
              </p>
            </div>

            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              hidden
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            />

            {audioFile && (
              <button
                onClick={() => uploadFile(audioFile)}
                disabled={uploading}
                className="mt-4 w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Audio"}
              </button>
            )}

          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 text-lg">
                📄
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Documents
              </h3>
            </div>

            <p className="text-sm text-gray-600">
              Upload PDFs or text files such as requirements, notes, or design
              docs related to your project.
            </p>

            <div
              onClick={() => docInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-slate-50 hover:border-purple-500 transition-colors"
            >
              <p className="text-sm font-medium text-gray-700">
                {docFile ? docFile.name : "Drag & drop document"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse
              </p>
            </div>

            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.txt"
              hidden
              onChange={(e) => setDocFile(e.target.files?.[0] || null)}
            />

            {docFile && (
              <button
                onClick={() => uploadFile(docFile)}
                disabled={uploading}
                className="mt-4 w-full rounded-lg bg-purple-600 text-white py-2 text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
            )}

          </div>
        </div>
      </div>

      {message && (
        <p className="text-sm text-green-600 font-medium">
          {message}
        </p>
      )}
      
      {backendStatus && (
        <p className="text-xs text-gray-500">
          Backend status: {backendStatus}
        </p>
      )}
      <p className="text-sm text-gray-500">
        Supported formats: MP3, WAV, PDF, TXT · Files are processed securely.
      </p>


    </div>
  );
}
