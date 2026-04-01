/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
        'noto-serif': ['"Noto Serif SC"', 'serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // CSS variable-based colors (映射 global.css 中的 CSS 变量)
        'paper-accent': 'var(--paper-accent)',
        'paper-bg': 'var(--paper-bg)',
        'paper-border': 'var(--paper-border)',
        'text-primary': 'var(--text-color)',
        'heading-primary': 'var(--heading-color)',
        'link-primary': 'var(--link-color)',
        'border-primary': 'var(--border-color)',
        'bg-primary': 'var(--bg-color)',
        'masthead-bg': 'var(--masthead-bg)',
        'sidebar-bg': 'var(--sidebar-bg)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '800px',
            lineHeight: '1.7',
            h1: {
              fontFamily: '"Source Serif 4", Georgia, serif',
              fontWeight: '600',
            },
            h2: {
              fontFamily: '"Source Serif 4", Georgia, serif',
              fontWeight: '600',
            },
            h3: {
              fontFamily: '"Source Serif 4", Georgia, serif',
              fontWeight: '600',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
