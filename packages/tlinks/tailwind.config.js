/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      'bg-primary': 'var(--tlink-bg-primary)',
      'bg-secondary': 'var(--tlink-bg-secondary)',
      button: 'var(--tlink-button)',
      'button-success': 'var(--tlink-button-success)',
      'button-disabled': 'var(--tlink-button-disabled)',
      'button-hover': 'var(--tlink-button-hover)',
      'input-bg': 'var(--tlink-input-bg)',
      'input-bg-selected': 'var(--tlink-input-bg-selected)',
      'input-bg-disabled': 'var(--tlink-input-bg-disabled)',
      'input-stroke': 'var(--tlink-input-stroke)',
      'input-stroke-selected': 'var(--tlink-input-stroke-selected)',
      'input-stroke-hover': 'var(--tlink-input-stroke-hover)',
      'input-stroke-error': 'var(--tlink-input-stroke-error)',
      'input-stroke-disabled': 'var(--tlink-input-stroke-disabled)',
      'icon-error': 'var(--tlink-icon-error)',
      'icon-error-hover': 'var(--tlink-icon-error-hover)',
      'icon-primary': 'var(--tlink-icon-primary)',
      'icon-primary-hover': 'var(--tlink-icon-primary-hover)',
      'icon-warning': 'var(--tlink-icon-warning)',
      'icon-warning-hover': 'var(--tlink-icon-warning-hover)',
      'stroke-error': 'var(--tlink-stroke-error)',
      'stroke-primary': 'var(--tlink-stroke-primary)',
      'stroke-secondary': 'var(--tlink-stroke-secondary)',
      'stroke-warning': 'var(--tlink-stroke-warning)',
      'text-brand': 'var(--tlink-text-brand)',
      'text-button': 'var(--tlink-text-button)',
      'text-button-success': 'var(--tlink-text-button-success)',
      'text-button-disabled': 'var(--tlink-text-button-disabled)',
      'text-input': 'var(--tlink-text-input)',
      'text-input-disabled': 'var(--tlink-text-input-disabled)',
      'text-input-placeholder': 'var(--tlink-text-input-placeholder)',
      'text-link': 'var(--tlink-text-link)',
      'text-link-hover': 'var(--tlink-text-link-hover)',
      'text-primary': 'var(--tlink-text-primary)',
      'text-secondary': 'var(--tlink-text-secondary)',
      'text-success': 'var(--tlink-text-success)',
      'text-warning': 'var(--tlink-text-warning)',
      'text-warning-hover': 'var(--tlink-text-warning-hover)',
      'text-error': 'var(--tlink-text-error)',
      'text-error-hover': 'var(--tlink-text-error-hover)',
      'transparent-error': 'var(--tlink-transparent-error)',
      'transparent-grey': 'var(--tlink-transparent-grey)',
      'transparent-warning': 'var(--tlink-transparent-warning)',
      transparent: 'transparent',
      currentColor: 'currentColor',
    },
    borderRadius: {
      lg: 'var(--tlink-border-radius-rounded-lg)',
      xl: 'var(--tlink-border-radius-rounded-xl)',
      '2xl': 'var(--tlink-border-radius-rounded-2xl)',
      button: 'var(--tlink-border-radius-rounded-button)',
      input: 'var(--tlink-border-radius-rounded-input)',
      'input-standalone': 'var(--tlink-border-radius-rounded-input-standalone)',
      full: '9999px',
      none: '0px',
    },
    extend: {
      fontSize: {
        // assuming twitter font size base - 15px
        text: ['1rem', '1.2rem'],
        subtext: ['0.867rem', '1.067rem'],
        caption: ['0.73333rem', '0.93333rem'],
      },
      boxShadow: {
        action: 'var(--tlink-shadow-container)',
      },
    },
  },
  plugins: [],
};
