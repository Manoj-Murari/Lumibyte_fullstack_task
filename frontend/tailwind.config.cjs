/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Note: darkMode is configured via @custom-variant in index.css for Tailwind v4
  theme: {
    extend: {},
  },
  plugins: [],
}