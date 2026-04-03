/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
        'noto-serif': ['"Noto Serif SC"', 'serif'],
      },
      colors: {
        // Light theme colors
        'bg-primary': '#FAF8F5',
        'bg-dark': '#121212',
        'text-primary': '#3d3d3d',
        'text-dark': '#c9c9c9',
        'heading-primary': '#1a1a1a',
        'heading-dark': '#e8e8e8',
        'link-primary': '#2563eb',
        'link-dark': '#60a5fa',
        'border-primary': '#E5E5E5',
        'border-dark': '#2A2A2A',
        'paper-bg': '#FFFFFF',
        'paper-bg-dark': '#1E1E1E',
        'paper-border': '#E5E5E5',
        'paper-border-dark': '#2A2A2A',
        'paper-accent': '#1e3a5f',
        'paper-accent-dark': '#60a5fa',
        // Tag colors
        'tag-field-bg': '#dbeafe',
        'tag-field-bg-dark': '#1e3a5f',
        'tag-field-text': '#1e40af',
        'tag-field-text-dark': '#93c5fd',
        'tag-tech-bg': '#f3f4f6',
        'tag-tech-bg-dark': '#3a3a3a',
        'tag-tech-text': '#374151',
        'tag-tech-text-dark': '#d1d5db',
        // Scholar badge colors
        'scholar-badge-bg': '#f6f6f6',
        'scholar-badge-bg-dark': '#2d2d2d',
        'scholar-badge-count-bg': '#ffffff',
        'scholar-badge-count-bg-dark': '#121212',
        'scholar-icon': '#4A90E2',
        'scholar-badge-text': '#3d3d3d',
        'scholar-badge-text-dark': '#c9c9c9',
        'scholar-badge-count': '#4A90E2',
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
