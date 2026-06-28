import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  // Dark mode via [data-theme="dark"] attribute on <html>
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      // Bridge CSS custom properties into Tailwind tokens
      colors: {
        canvas: 'var(--canvas)',
        'canvas-2': 'var(--canvas-2)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        accent: 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        'accent-soft': 'var(--accent-soft)',
        ai: 'var(--ai)',
        'ai-soft': 'var(--ai-soft)',
        success: 'var(--success)',
        'success-soft': 'var(--success-soft)',
        warning: 'var(--warning)',
        'warning-soft': 'var(--warning-soft)',
        danger: 'var(--danger)',
        'danger-soft': 'var(--danger-soft)',
        info: 'var(--info)',
        'info-soft': 'var(--info-soft)',
        purple: 'var(--purple)',
        'purple-soft': 'var(--purple-soft)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        pop: 'var(--shadow-pop)',
      },
      fontSize: {
        sm: 'var(--fs-sm)',
        base: 'var(--fs-base)',
        lg: 'var(--fs-lg)',
        display: 'var(--fs-display)',
        stat: 'var(--fs-stat)',
      },
      spacing: {
        'sidebar': 'var(--sidebar-w)',
        'topbar': 'var(--topbar-h)',
        'card': 'var(--pad-card)',
        'gap': 'var(--gap)',
        'row': 'var(--row-h)',
      },
    },
  },
  plugins: [],
}

export default config
