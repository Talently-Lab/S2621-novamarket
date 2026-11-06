import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Paleta del UI Kit de UX/UI (Figma). Los componentes usan solo estos tokens.
      colors: {
        ink: '#132238',
        navy: '#10243A',
        primary: '#1849D6',
        hover: '#123BB1',
        accent: '#FACC15',
        canvas: '#F5F7FA',
        soft: '#E9EFF7',
        border: '#D2DAE5',
        'control-border': '#7D8BA0',
        muted: '#576477',
        error: '#B42318',
        success: '#13724D',
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        logo: ['"Fredoka One"', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        control: '10px',
        card: '16px',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
};
