/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FDFBF7", // Anthropic cream/off-white background
        secondary: "#FFFFFF", // Pure white for cards/elements
        accent: "#D97757", // Soft terracotta/orange
        highlight: "#E6A893", // Lighter orange for hover
        text: {
          main: "#1A1A1A", // Near black for text
          muted: "#555555" // Gray for secondary text
        },
        border: {
          light: "#E3E1DB"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}