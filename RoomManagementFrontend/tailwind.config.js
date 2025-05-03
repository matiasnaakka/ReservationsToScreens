/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: '#ff5000', // Metropolia's orange
        gray: '#53565a',   // Metropolia's gray
        red: '#cb2228',    // Auxiliary red
        blue: '#4046a8',   // Auxiliary blue
        yellow: '#fff000', // Auxiliary yellow
        white: '#ffffff',  // White
        black: '#000000',  // Black
        green: '#3ba88f',  // Trend green
        pink: '#e384c4',   // Trend pink
        lightBlue: '#5db1e4', // Trend light blue
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'], // Default sans-serif fallback
      },
    },
  },
  plugins: [],
}
