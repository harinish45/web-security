/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0a0f',
          dark: '#12121a',
          panel: '#1a1a25',
          border: '#2a2a3a',
          primary: '#00ff9d',
          secondary: '#00d4ff',
          danger: '#ff3366',
          warning: '#ffaa00',
          success: '#00ff9d',
          info: '#00d4ff',
        }
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}