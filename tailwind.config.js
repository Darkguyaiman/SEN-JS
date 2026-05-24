/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs', './components/**/*.ejs'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
