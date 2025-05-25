import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          200: '#E9D5FF',
          400: '#C084FC',
        },
        pink: {
          300: '#F9A8D4',
        },
        blue: {
          400: '#60A5FA',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
      },
    },
  },
  plugins: [
    typography,
  ],
};

export default config; 