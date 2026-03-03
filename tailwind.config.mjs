/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
      maxWidth: {
        app: '3xl',
      },
      spacing: {
        'app-px': '2rem',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        '.nav-active': {
          '@apply underline decoration-wavy decoration-2 underline-offset-8': {},
        },
        '.prose-astro-paper': {
          '@apply prose prose-sm md:prose md:prose-lg': {},
        },
      });
    },
  ],
};
