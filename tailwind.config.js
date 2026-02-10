/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",  // ← ADD THIS LINE
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}