const daisyui = require('daisyui');
/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [daisyui],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#1B98F5',
          secondary: '#12B0E8',
          accent: '#50DBB4',
          neutral: '#3D4451',
          'base-100': '#FFFFFF',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#B4161B',
          error: '#F87272',
        },
      },
      'dark',
      'cupcake',
    ],
  },
};
