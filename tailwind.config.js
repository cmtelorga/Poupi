/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Nunito', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 4px 20px -4px rgba(79, 70, 229, 0.15)',
        soft: '0 2px 8px -2px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
};
