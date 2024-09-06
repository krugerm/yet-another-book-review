/** @type {import('tailwindcss').Config} */
import flowbiteReact from "flowbite-react/tailwind";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // "node_modules/flowbite-react/lib/esm/**/*.js",
    // "node_modules/@tailwindcss/line-clamp/**/*.js",
    flowbiteReact.content(),
  ],
  theme: {
    extend: {
      textAlign: {
        left: 'left',
      },
      colors: {
        bg: {
          primary: 'white',
        },
        primary: {
          DEFAULT: '#3490dc',
          light: '#63b3ed',
          dark: '#2779bd',
        },
      },
      button: {
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),

    plugin(function({ addBase, theme }) {
      addBase({
        'label': {
          textAlign: theme('textAlign.left'),
        },
      })
    })
  ],
};
