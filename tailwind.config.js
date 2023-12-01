import { withShurikenUI } from '@shuriken-ui/tailwind';
import colors from 'tailwindcss/colors';

export default withShurikenUI({
  darkMode: 'class',
  content: [],
  theme: {
    fontFamily: {
      sans: ['Inter  Variable', 'sans-serif'],
      heading: ['Inter  Variable', 'sans-serif'],
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
          50: '#f0ffee',
          100: '#d9ffd8',
          200: '#b5ffb3',
          300: '#82fd7f',
          400: '#3af236',
          500: '#10db0c',
          600: '#06b603',
          700: '#098e07',
          800: '#0d6f0c',
          900: '#0c5b0d',
          950: '#003301',
        },
        muted: colors.neutral,
      },
      shurikenUi: {
        tooltip: {
          bgDark: '[#10db0c]',
        },
      },
    },
  },
});
