import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#808080',
          dark: '#404040',
          light: '#A0A0A0',
        },
        accent: {
          cyan: '#FFFFFF',    // Monochrome: Pure White
          blue: '#C0C0C0',    // Monochrome: Silver
          white: '#FFFFFF',   // Pure White
          silver: '#C0C0C0',  // Silver
          gray: '#808080',    // Medium Gray
        },
        dark: {
          bg: '#000000',      // Pure Black
          secondary: '#151515',
          tertiary: '#202020',
          border: '#303030',
        },
        metallic: {
          silver: '#C0C0C0',
          'dark-silver': '#A0A0A0',
          chrome: '#E0E0E0',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #A0A0A0 0%, #FFFFFF 50%, #C0C0C0 100%)', // Chrome effect
        'gradient-monochrome': 'linear-gradient(135deg, #A0A0A0 0%, #FFFFFF 50%, #C0C0C0 100%)',
        'gradient-metallic': 'linear-gradient(135deg, #808080 0%, #C0C0C0 50%, #E0E0E0 100%)',
        'gradient-silver': 'linear-gradient(135deg, #606060 0%, #C0C0C0 50%, #808080 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
        'metallic-shine': 'metallicShine 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(192, 192, 192, 0.6)' },
        },
        metallicShine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
