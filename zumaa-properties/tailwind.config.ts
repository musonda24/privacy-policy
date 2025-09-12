import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#22C55E',
          dark: '#16A34A',
          light: '#86EFAC',
        },
      },
    },
  },
  plugins: [],
} satisfies Config

