/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'photo-gold': '#facc15', // Vàng rực rỡ cho các nút bấm quan trọng
        'photo-black': '#0a0a0a', // Đen sâu thẳm cho nền
        'photo-gray': '#1a1a1a', // Xám đậm cho các thẻ (Card)
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}