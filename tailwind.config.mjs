/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        chalk: '#F7F6F2',
        ink: {
          DEFAULT: '#141414',
          mid: '#1b2a4a',
        },
        coral: '#EE4E29',
        electric: '#FFE135',
        sky: '#C9E8FF',
        mint: '#C8F0D0',
        peach: '#FFE0CB',
        lavender: '#EDE9FF',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.02em',
      },
      boxShadow: {
        'offset-sm': '3px 3px 0 0 #141414',
        'offset-md': '5px 5px 0 0 #141414',
        'offset-hover': '1px 1px 0 0 #141414',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
