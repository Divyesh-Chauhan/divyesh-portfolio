/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pirate: {
          bg: '#1a1c29',
          primary: '#e63946',
          secondary: '#457b9d',
          gold: '#f4a261',
          wood: '#6b4c3a',
          darkwood: '#3e2723',
          paper: '#fefae0',
        }
      },
      fontFamily: {
        pirate: ['"Cinzel Decorative"', 'cursive'],
        body: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
