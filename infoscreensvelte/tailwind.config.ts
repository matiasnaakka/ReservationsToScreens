import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type {Config} from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      fontFamily: {
        heading: ['"Roboto Slab"', 'serif'],
        body: ['"Open Sans"', 'sans-serif']
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1380px',
        '2xl': '1536px',
        '3xl': '1920px'
      },
      colors: {
        metropoliaMainOrange: '#ff5000',
        metropoliaSecondaryOrange: '#e54b00',
        metropoliaMainGrey: '#53565a',
        metropoliaSupportWhite: '#ffffff',
        metropoliaSupportBlack: '#000000',
        metropoliaSupportRed: '#cb2228',
        metropoliaSupportSecondaryRed: '#e60000',
        metropoliaSupportBlue: '#4046a8',
        metropoliaSupportYellow: '#fff000',
        metropoliaTrendPink: '#e384c4',
        metropoliaTrendLightBlue: '#5db1e4',
        metropoliaTrendGreen: '#3ba88f',
        seventh: {
          DEFAULT: '#74B0F9'
        },
        sixth: {
          DEFAULT: '#D70580'
        },
        fifth: {
          DEFAULT: '#FA6707'
        },
        second: {
          DEFAULT: '#F8DC0E'
        }
      }
    }
  },

  plugins: [typography, forms, containerQueries]
} satisfies Config;
