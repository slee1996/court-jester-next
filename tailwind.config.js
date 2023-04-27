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
      },
      textColor: {
        'editor-text': '#d4d4d4',
      },
    },
  },
  plugins: [],
};
