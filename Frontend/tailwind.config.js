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
          DEFAULT: "#6366f1", // Indigo 500 — purple from image
          light: "#818cf8",   // Indigo 400
          dark: "#4f46e5",    // Indigo 600
        },
        secondary: {
          DEFAULT: "#64748b",
          light: "#94a3b8",
          dark: "#475569",
        },
        success: {
          DEFAULT: "#10b981",
          dark: "#059669",
        },
        warning: {
          DEFAULT: "#f59e0b",
          dark: "#d97706",
        },
        danger: {
          DEFAULT: "#ef4444",
          dark: "#dc2626",
        },
        info: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
        },
        background: "#f0f2f5",  // Warm light gray — matches image bg
        surface: "#ffffff",
        sidebar: "#1e2139",     // Dark navy — matches image sidebar
        text: {
          DEFAULT: "#1e293b",   // Slate 800
          light: "#64748b",
          dark: "#0f172a",
        },
        muted: "#94a3b8",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px 0 rgba(0, 0, 0, 0.07)',
        'card-hover': '0 4px 24px 0 rgba(0, 0, 0, 0.11)',
        'soft': '0 1px 4px 0 rgba(0, 0, 0, 0.05)',
        'dropdown': '0 8px 30px 0 rgba(0, 0, 0, 0.13)',
        'glow-primary': '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
        'glow-success': '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
        'glow-danger': '0 4px 14px 0 rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}
