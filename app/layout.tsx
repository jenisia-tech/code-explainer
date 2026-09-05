import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"], // Include the weights you need
});

export const metadata: Metadata = {
  title: "Code Explainer | AI-Powered Interactive Coding Platform",
  description: "Learn to code with live execution, step-by-step AI explanation, visual debugging, quizzes, and interactive practice arena.",
};

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#020617] text-sky-400 flex items-center justify-center font-mono">
      <div className="text-center space-y-3">
        <div className="inline-block w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sky-300/80 text-xs font-semibold terminal-cursor tracking-wider">INITIALIZING CYBER TERMINAL...</p>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono antialiased pixel-game-bg text-sky-100">
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}