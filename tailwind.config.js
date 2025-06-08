/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6', // Фиолетовый для акцентов
        dark: '#1e293b', // Тёмный фон
        light: '#f8fafc' // Светлый текст
      },
    },
  },
  plugins: [],
};
