/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include *all* files that use className (screens, components, etc.)
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',       
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        light: '#F7FAFA',
        dark: {
          10: '#E8F2ED',
          100: '#59615cff',
          200: '#0D1A12',
        },
      },
    },
  },
  plugins: [],
};
