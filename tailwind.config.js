/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFBF69',    // Light orange
        secondary: {
          orange: '#FF9F1C',   // Bright orange
          pink: '#CB997E',     // Muted pink
          peach: '#FFE8D6',    // Pale peach
        },
        text: '#FFFFFF',       // White
      },
      fontFamily: {
        sans: ['Lora', 'serif'],
      },
      backgroundImage: {
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        'gradient-flow': {
          '0%': {
            backgroundPosition: '0% 50%'
          },
          '50%': {
            backgroundPosition: '100% 50%'
          },
          '100%': {
            backgroundPosition: '0% 50%'
          }
        }
      },
      animation: {
        'gradient-flow': 'gradient-flow 15s ease infinite'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 