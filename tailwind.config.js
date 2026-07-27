/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        azul:     '#3E658E',
        blush:    '#FDDED5',
        verde:    '#91B096',
        bordo:    '#6B2F3C',
        coral:    '#FD745D',
        mostarda: '#FDBB71',
        escuro:   '#282828',
      },
    },
  },
  plugins: [],
}
