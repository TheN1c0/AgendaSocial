/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '.dark-mode'], // enable dark mode via custom class
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#F7E8EC',
          DEFAULT: '#C97A8A',
          dark: '#8C4A5A',
        }
      }
    },
  },
  plugins: [],
}
