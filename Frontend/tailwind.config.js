/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // Slate 900
        "primary-light": "#334155", // Slate 700
        "primary-dark": "#020617", // Slate 950
        secondary: "#64748b",
        "secondary-light": "#94a3b8",
        "secondary-dark": "#475569",
        success: "#10b981",
        "success-dark": "#059669",
        warning: "#f59e0b",
        "warning-dark": "#d97706",
        danger: "#ef4444",
        "danger-dark": "#dc2626",
        info: "#3b82f6",
        "info-dark": "#2563eb",
        background: {
          DEFAULT: "#f0f2f5",
          surface: "#ffffff",
        },
        sidebar: {
          bg: "#1e2139",
          text: "#94a3b8",
          hover: "#2e324d",
          active: "#9333ea",
        },
        tag: {
          bg: "#e0e7ff",
          text: "#4f46e5",
        },
        profile: {
          bg: "#9333ea",
          text: "#ffffff",
        },
        name: {
          text: "#1e293b",
        },
        text: {
          DEFAULT: "#1e293b",
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
        'glow-primary': '0 4px 14px 0 rgba(15, 23, 42, 0.25)',
        'glow-success': '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
        'glow-danger': '0 4px 14px 0 rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}
