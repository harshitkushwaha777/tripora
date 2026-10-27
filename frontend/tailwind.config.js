/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FAF8F5',
          100: '#F5F1EB',
          200: '#EDE6DC',
          300: '#DFD6C7',
          400: '#C8BEAD',
        },
        forest: {
          950: '#081410',
          900: '#0D1F18',
          800: '#132B22',
          700: '#1B3B2F',
          600: '#265342',
          500: '#346B55',
          400: '#46896E',
          100: '#E2EBE6',
          50: '#F0F5F2',
        },
        coral: {
          900: '#732613',
          800: '#943118',
          700: '#B63D1E',
          600: '#C95233',
          500: '#E06343',
          400: '#E87D61',
          300: '#F1A28D',
          100: '#FDEAE4',
          50: '#FEF4F1',
        },
        ink: {
          900: '#141A17',
          800: '#222C27',
          700: '#3B4841',
          600: '#54655C',
          500: '#708378',
          400: '#95A69D',
          300: '#BCC7C0',
          200: '#DFE5E1',
          100: '#F1F4F2',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(13, 31, 24, 0.05), 0 4px 6px -4px rgba(13, 31, 24, 0.03)',
        'elevated': '0 10px 25px -5px rgba(13, 31, 24, 0.08), 0 8px 10px -6px rgba(13, 31, 24, 0.04)',
        'modal': '0 25px 50px -12px rgba(13, 31, 24, 0.25)',
      }
    },
  },
  plugins: [],
}
