import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tint: {
          light: 'var(--tint-light)',
          dark: 'var(--tint-dark)',
        },
        secondary: {
          light: 'var(--secondary-light)',
          dark: 'var(--secondary-dark)',
        },
        custom: {
          text: '#333D43',
          background: '#F2F0EF',
          icon: '#4A5568',
          darkText: '#ECEDEE',
          darkBg: '#1B1F23',
          darkIcon: '#A0AEC0',
        }
      },
      backgroundColor: {
        primary: 'var(--tint-light)',
        secondary: 'var(--secondary-light)',
      },
      textColor: {
        primary: 'var(--tint-light)',
        secondary: 'var(--secondary-light)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
