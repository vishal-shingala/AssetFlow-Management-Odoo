/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1", // Indigo 500
          light: "#818cf8", // Indigo 400
          dark: "#4f46e5", // Indigo 600
        },
        secondary: {
          DEFAULT: "#64748b", // Slate 500
          light: "#94a3b8", // Slate 400
          dark: "#475569", // Slate 600
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
        background: "#f8fafc", // Slate 50
        surface: "#ffffff",
        sidebar: "#0f172a", // Dark navy for sidebar
        text: {
          DEFAULT: "#334155", // Slate 700
          light: "#64748b", // Slate 500
          dark: "#0f172a", // Slate 900
        },
        muted: "#94a3b8",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
