/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateRows: {
        "first-row-0.25": "0.25fr repeat(auto-fill, 1fr)",
      },
      backgroundColor: {
        'editor-bg': '#1e1e1e',
        'vivid-forest': '#2E8B57',
        'pastel-sea': '#87CEEB',
        'earthy-brown': '#8B4513',
        'canvas-cream': '#FDF5E6',
        'gods-touch': '#FFD700',
      },
      textColor: {
        'editor-text': '#d4d4d4',
        'vivid-forest': '#2E8B57',
        'pastel-sea': '#87CEEB',
        'earthy-brown': '#8B4513',
        'canvas-cream': '#FDF5E6',
        'gods-touch': '#FFD700',
      },
    },
  },
  plugins: [],
};
