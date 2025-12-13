import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">
        ProSync.ai
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        Your AI-powered project memory for documents, meetings, and decisions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/upload">
          <div className="border rounded-xl p-6 bg-white hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Upload</h3>
            <p className="text-gray-500 text-sm">
              Add documents or meeting recordings to your project memory.
            </p>
          </div>
        </Link>

        <Link href="/chat">
          <div className="border rounded-xl p-6 bg-white hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Chat</h3>
            <p className="text-gray-500 text-sm">
              Ask questions and get answers grounded in your project context.
            </p>
          </div>
        </Link>

        <Link href="/memory">
          <div className="border rounded-xl p-6 bg-white hover:shadow-lg cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Memory</h3>
            <p className="text-gray-500 text-sm">
              Review everything ProSync.ai has learned so far.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
