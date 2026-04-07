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
        // Light theme colors - Claude Design
        'bg-primary': '#f5f4ed',       // Parchment
        'bg-dark': '#141413',          // Deep Dark
        'text-primary': '#3d3d3d',     // (keep)
        'text-dark': '#c9c9c9',        // (keep)
        'heading-primary': '#141413',  // Anthropic Near Black
        'heading-dark': '#e8e8e8',      // (keep)
        'link-primary': '#c96442',      // Terracotta Brand
        'link-dark': '#d97757',         // Coral Accent
        'border-primary': '#f0eee6',   // Border Cream
        'border-dark': '#30302e',       // Dark Surface
        'paper-bg': '#faf9f5',         // Ivory
        'paper-bg-dark': '#30302e',    // Dark Surface
        'paper-border': '#f0eee6',      // Border Cream
        'paper-border-dark': '#30302e', // Dark Surface
        'paper-accent': '#c96442',     // Terracotta Brand
        'paper-accent-dark': '#d97757', // Coral Accent
        // Tag colors - warm tones
        'tag-field-bg': '#e8dcc8',      // Warm tan
        'tag-field-bg-dark': '#3d3529', // Dark warm brown
        'tag-field-text': '#5e4a3a',    // Dark brown
        'tag-field-text-dark': '#c9b89a', // Light tan
        'tag-tech-bg': '#e8e6dc',       // Warm sand
        'tag-tech-bg-dark': '#3a3a36',  // Dark warm gray
        'tag-tech-text': '#4d4c48',     // Charcoal warm
        'tag-tech-text-dark': '#b0aea5', // Warm silver
        // Scholar badge colors
        'scholar-badge-bg': '#f6f6f6',
        'scholar-badge-bg-dark': '#2d2d2d',
        'scholar-badge-count-bg': '#ffffff',
        'scholar-badge-count-bg-dark': '#121212',
        'scholar-icon': '#4A90E2',
        'scholar-badge-text': '#3d3d3d',
        'scholar-badge-text-dark': '#c9c9c9',
        'scholar-badge-count': '#4A90E2',
        // Secondary text color - warm grays
        'text-secondary': '#5e5d59',   // Olive Gray
        'text-secondary-dark': '#87867f', // Stone Gray
      },
    },
  },
  plugins: [],
};
