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
          light: '#3b82f6', // blue-500
          DEFAULT: '#2563eb', // blue-600
          dark: '#1d4ed8', // blue-700
        },
        alert: {
          info: '#3b82f6',
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
