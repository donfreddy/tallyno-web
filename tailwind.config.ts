import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    "./components/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#F0F4FF',
          100: '#E0EAFF',
          500: '#4361EE',
          600: '#3451D1',
          700: '#2A40B0',
          900: '#0F172A',
        },
        wa: '#25D366',  // WhatsApp green
      },
    },
  },
}