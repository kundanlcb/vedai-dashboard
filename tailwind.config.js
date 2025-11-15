/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',
        secondary: '#DC004E',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        info: '#2196F3',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        'text-primary': '#212121',
        'text-secondary': '#757575',
        disabled: '#BDBDBD',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      typography: {
        sm: {
          css: {
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '1.5',
          },
        },
      },
      screens: {
        mobile: '320px',
        tablet: '641px',
        desktop: '1025px',
        wide: '1441px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}

