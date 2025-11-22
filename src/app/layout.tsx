import "./globals.css";

export const metadata = {
  title: "Tourism-AI",
  description: "Tourism multi-agent system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-purple-100 min-h-screen w-full overflow-y-auto relative h-screen">
        {/* Floating Navbar */}
        <div className="w-full flex justify-center pt-6 pb-2 fixed top-0 left-0 z-50 pointer-events-none">
          <nav
            className="pointer-events-auto px-10 py-3
            bg-black/70 backdrop-blur-xl
            border border-purple-900/40
            rounded-full
            shadow-md shadow-purple-900/20
            flex gap-10 text-sm font-semibold items-center"
          >
            <a href="/" className="hover:text-purple-300 transition-colors">
              Home
            </a>

            <a
              href="/about"
              className="hover:text-purple-300 transition-colors"
            >
              About Us
            </a>

            <a
              href="/agents"
              className="hover:text-purple-300 transition-colors"
            >
              Agents
            </a>
          </nav>
        </div>

        {children}
      </body>
    </html>
  );
}
