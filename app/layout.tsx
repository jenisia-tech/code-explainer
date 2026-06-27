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
  title: "Code Explainer",
  description: "Explain your code like a pro",
};

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-950 text-green-400 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-green-600 terminal-cursor">Loading system...</p>
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
      <body className="font-mono antialiased pixel-game-bg">
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}