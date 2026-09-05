import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "Fira Code", "Ubuntu Mono", "Source Code Pro", "Courier New", "monospace"],
      },
      colors: {
        // Black & Electric Blue Cyber Palette
        terminal: {
          bg: "#020617",
          dark: "#010409",
          blue: "#38bdf8",
          electric: "#0ea5e9",
          cyan: "#06b6d4",
          indigo: "#6366f1",
          dim: "#1e293b",
          bright: "#e0f2fe",
        },
      },
    },
  },
  plugins: [],
};
export default config;