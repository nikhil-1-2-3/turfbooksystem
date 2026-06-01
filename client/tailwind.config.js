/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        richblack: {
          5: "#F1F2FF",
          25: "#DBDDEA",
          50: "#C5C7D4",
          100: "#AFB2BF",
          200: "#999DAA",
          300: "#838894",
          400: "#6D727F",
          500: "#585D69",
          600: "#424854",
          700: "#2C333F",
          800: "#161D29",
          900: "#000814",
        },
        pink: {
          200: "#EF476F",
        },
        yellow: {
          50: "#FFD60A",
        },
        peach: {
          bg: "#f8fafc",
        },
        navy: {
          blue: "#0f172a",
        },
        dusty: {
          pink: "#22c55e",
        },
        turf: {
          green: "#15803d",
          neon: "#22c55e",
          dark: "#022c22",
        },
        slate: {
          950: "#020617",
          900: "#0f172a",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.05)",
          dark: "rgba(15, 23, 42, 0.3)",
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'elegant': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'elegant-dark': '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
