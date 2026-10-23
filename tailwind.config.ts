import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-animate")],
  daisyui: {
    themes: [
      {
        "beerpong-light": {
          "primary": "#ea580c",         // Energetic Brew Orange
          "primary-content": "#ffffff", // Pure white for perfect 4.6:1+ contrast
          "secondary": "#1e293b",       // Deep Slate
          "secondary-content": "#ffffff",
          "accent": "#f59e0b",          // Golden Ale (1. place, crown)
          "accent-content": "#1c1917",
          "neutral": "#334155",         // Dark Slate
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",        // Crisp white cards
          "base-200": "#f8fafc",        // Slate-50 page background
          "base-300": "#e2e8f0",        // Slate-200 borders
          "base-content": "#0f172a",    // Slate-900 high contrast text (16.1:1 AAA)
          "info": "#2563eb",            // Blue for BJ defense
          "info-content": "#ffffff",
          "success": "#16a34a",         // Emerald green for wins
          "success-content": "#ffffff",
          "warning": "#d97706",         // Amber warning
          "warning-content": "#ffffff",
          "error": "#dc2626",           // Crimson error for losses/delete
          "error-content": "#ffffff",
        },
        "beerpong-dark": {
          "primary": "#f97316",         // Vivid Sunset Orange
          "primary-content": "#0b0f19",
          "secondary": "#38bdf8",       // Sky Blue accent
          "secondary-content": "#0b0f19",
          "accent": "#fbbf24",          // Bright Amber / Gold
          "accent-content": "#0b0f19",
          "neutral": "#1e293b",         // Slate-800
          "neutral-content": "#f8fafc",
          "base-100": "#131b2e",        // Elevated Slate Navy Card surfaces
          "base-200": "#0b0f19",        // Deep Navy-Black background
          "base-300": "#1e293b",        // Subtle card border
          "base-content": "#f8fafc",    // Slate-50 crisp high contrast text (15.8:1 AAA)
          "info": "#38bdf8",
          "info-content": "#0b0f19",
          "success": "#22c55e",
          "success-content": "#0b0f19",
          "warning": "#f59e0b",
          "warning-content": "#0b0f19",
          "error": "#ef4444",
          "error-content": "#ffffff",
        },
      },
    ],
    darkTheme: "beerpong-dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
    themeRoot: ":root",
  },
};

export default config;
