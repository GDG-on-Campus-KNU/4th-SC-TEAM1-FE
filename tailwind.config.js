/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 브랜드 컬러
        primary: '#7FB77E',
        secondary: '#FFE382',
        softGray: '#f3f4f6',

        // 일기 감정 기록용
        happy: '#FFCE56',
        sad: '#6C63FF',
        calm: '#A0D8EF',
        angry: '#FF6B6B',
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-in',
        'float': 'float 2.5s ease-in-out infinite',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.08)',
      },
      screens: {
        sm: '360px',
      },
    },
  },
  plugins: [scrollbar,],
};
