import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E14",
        surface: "#1A1F2B",
        border: "#2A3142",
        paper: "#F5F3EE",
        paperdim: "#B9B6AC",
        accent: "#3DDC97",
        indigo: "#7C8CF8",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plexmono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
