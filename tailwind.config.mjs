/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // Deep navy
        accent: '#f59e0b',  // Warm gold
        'text-dark': '#111827',
        'text-light': '#f3f4f6',
        'bg-light': '#ffffff',
        'bg-dark': '#f9fafb', // Professional light gray tone
      },
      fontFamily: {
        sans: ['sans-serif'],
      },
    },
  },
  plugins: [],
}
