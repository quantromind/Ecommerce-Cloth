/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#1a1a1a",
        accent: "#D4AF37",
        highlight: "#D4AF37"
      }
    },
  },
  plugins: [],
}