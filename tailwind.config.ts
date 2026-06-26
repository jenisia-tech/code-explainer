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
        // Terminal-inspired color palette
        terminal: {
          bg: "#0a0a0a",
          green: "#4ade80",
          dim: "#22c55e",
          bright: "#86efac",
        },
      },
    },
  },
  plugins: [],
};
export default config;