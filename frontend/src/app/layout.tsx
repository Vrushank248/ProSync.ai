import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "ProSync.ai",
  description: "Project Intelligence Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-gray-900">

        {/* Header */}
<header className="border-b bg-white">
  <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    <h1 className="text-xl font-bold text-gray-900">
      ProSync.ai
    </h1>
    <nav className="space-x-6 text-sm font-semibold text-gray-700">
      <Link
        href="/upload"
        className="hover:text-blue-600 transition-colors"
      >
        Upload
      </Link>
      <Link
        href="/chat"
        className="hover:text-blue-600 transition-colors"
      >
        Chat
      </Link>
      <Link
        href="/memory"
        className="hover:text-blue-600 transition-colors"
      >
        Memory
      </Link>
    </nav>
  </div>
</header>

        {/* Page Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
