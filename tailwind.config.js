export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        grouped: 'var(--bg-grouped)',
        card: 'var(--bg-card)',
        'card-2': 'var(--bg-card-2)',
        label: 'var(--label)',
        'label-secondary': 'var(--label-secondary)',
        'label-tertiary': 'var(--label-tertiary)',
        tint: 'var(--tint)',
      },
      borderRadius: {
        ios: '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
      },
      fontFamily: {
        sans: ['-apple-system', '"SF Pro Text"', '"SF Pro Display"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
