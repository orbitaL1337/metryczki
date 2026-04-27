import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "sky-soft": "#dff4ff",
        "sky-pale": "#cdeeff",
        coral: "#ff7f97",
        sky: "#4ea3df",
        ink: "#2f5b9f",
        cream: "#fff9f4",
        beige: "#f7efe8",
      },
      boxShadow: {
        soft: "0 10px 26px rgba(64, 108, 164, 0.12)",
        "soft-lg": "0 18px 36px rgba(64, 108, 164, 0.16)",
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "cursive"],
        script: ["var(--font-script)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
