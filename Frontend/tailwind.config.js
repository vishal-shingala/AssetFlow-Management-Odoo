/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#818CF8",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#DC2626",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        sidebar: "#111827",
        text: "#111827",
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
