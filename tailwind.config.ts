import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdf9f3",
          100: "#fbf3e7",
          200: "#f5e3c8"
        },
        pill: {
          50: "#fef0f3",
          100: "#fbd6df",
          200: "#f7adc0",
          300: "#f1839f",
          400: "#e8567c",
          500: "#d63b65",
          600: "#b22b50",
          700: "#8a1f3e"
        },
        rx: {
          50: "#eef4fb",
          100: "#d8e6f4",
          200: "#b5cee8",
          300: "#88aed6",
          400: "#5b8cc4",
          500: "#3a6da9",
          600: "#2c5586",
          700: "#1f3e63"
        },
        ink: {
          900: "#1a1818",
          800: "#2c2828",
          700: "#3f3a3a",
          500: "#7a7373",
          300: "#bfb8b3"
        }
      },
      fontFamily: {
        kai: ['"LXGW WenKai"', '"霞鹜文楷"', "KaiTi", "STKaiti", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"]
      },
      boxShadow: {
        pill: "0 8px 24px -8px rgba(214,59,101,0.35), 0 2px 4px rgba(0,0,0,0.05)",
        prescription: "0 2px 0 #d8e6f4, 0 4px 12px -4px rgba(58,109,169,0.25)"
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        floaty: "floaty 3.5s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite"
      },
      backgroundImage: {
        "paper-grid":
          "linear-gradient(rgba(58,109,169,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(58,109,169,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
