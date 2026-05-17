import type { Config } from 'tailwindcss'

export default <Config>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
}