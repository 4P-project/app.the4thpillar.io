import { withShurikenUI } from '@shuriken-ui/tailwind';
import colors from 'tailwindcss/colors';

export default withShurikenUI({
  darkMode: 'class',
  content: [],
  theme: {
    fontFamily: {
      sans: ['Space Grotesk Variable', 'sans-serif'],
      heading: ['Space Grotesk Variable', 'sans-serif'],
      alt: ['Karla  Variable', 'sans-serif'],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a756e2',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        muted: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#33335d',
          700: '#21213f',
          800: '#14142c',
          900: '#010314',
          950: '#00010A',
        },
      },
      shurikenUi: {
        tooltip: {
          bgDark: '[#9333ea]',
        },
      },
    },
  },
});
