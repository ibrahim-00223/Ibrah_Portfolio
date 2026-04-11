import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:  '#000000',
          pink:   '#E6004C',
          white:  '#FFFFFF',
        },
        bg: {
          DEFAULT: '#080808',
          surface: '#111111',
          raised:  '#1a1a1a',
        },
        text: {
          primary:   '#FFFFFF',
          secondary: 'rgba(255,255,255,0.55)',
          tertiary:  'rgba(255,255,255,0.28)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong:  'rgba(255,255,255,0.15)',
          accent:  'rgba(230,0,76,0.35)',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem,8vw,6rem)',   { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2rem,5vw,3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.4rem,3vw,2rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'pulse-pink': 'pulsePink 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulsePink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      boxShadow: {
        'card':        '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        'card-hover':  '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(230,0,76,0.25)',
        'pink-glow':   '0 0 24px rgba(230,0,76,0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config
