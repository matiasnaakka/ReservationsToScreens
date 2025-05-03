/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '2xl': '1536px', // ✅ Ensure 2xl breakpoint is defined
      },
      colors: {
        metropoliaOrange: '#ff5000',
        metropoliaGray: '#53565a',
        metropoliaRed: '#cb2228',
        metropoliaBlue: '#4046a8',
        metropoliaYellow: '#fff000',
        metropoliaPink: '#e384c4',
        metropoliaLightBlue: '#5db1e4',
        metropoliaGreen: '#3ba88f',
      },
      fontFamily: {
        title: ['Roboto Slab', 'serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        'campus-bg': "url('https://www.metropolia.fi/sites/default/files/images/Kampukset/karamalmin-kampus.jpg')", // ✅ Background image
      },
    },
  },
  plugins: [],
};
