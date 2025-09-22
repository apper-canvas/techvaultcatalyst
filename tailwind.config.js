/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b', 
        accent: '#f59e0b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce 0.5s ease-in-out 1',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'soft': '0 4px 8px rgba(0,0,0,0.1)',
        'soft-lg': '0 8px 16px rgba(0,0,0,0.12)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.3)',
      },
    },
  },
  plugins: [],
}