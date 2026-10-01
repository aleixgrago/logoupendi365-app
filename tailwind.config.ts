import type { Config } from "tailwindcss";

// Paleta pensada per no semblar "SaaS genèric": blau suau com a base professional
// + un verd-menta càlid com a accent de progrés/èxit (moment "exercici completat").
// S'hi afegeix una segona paleta ("coral"/"sunny"), més vibrant, pensada
// específicament per a la part de pares/nens (on l'objectiu és motivar i
// fer-ho atractiu) — la part del logopeda es queda amb el to professional
// original a propòsit.
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d9e9ff",
          300: "#8fb8f5",
          500: "#3b74d9",
          600: "#2f5eb3",
          700: "#274c8f",
        },
        progress: {
          100: "#e3f9ef",
          400: "#3ecf8e",
          600: "#219a68",
        },
        ink: {
          50: "#f7f8fa",
          100: "#eceef2",
          400: "#8a94a6",
          700: "#3a4150",
          900: "#1c2029",
        },
        coral: {
          50: "#fff1ec",
          100: "#ffe0d6",
          400: "#ff8a65",
          500: "#ff6f43",
          600: "#e85a30",
        },
        sunny: {
          100: "#fff6d9",
          400: "#ffcc33",
          500: "#ffbb00",
        },
        fun: {
          50: "#f6eeff",
          100: "#e9d8ff",
          400: "#a569f7",
          500: "#8c3df0",
          600: "#7429d6",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
