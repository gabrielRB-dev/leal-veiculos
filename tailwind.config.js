/** @type {import('tailwindcss').Config} */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'dark': '#0C0C0E',
        'light': '#FAFAFA',
        'muted': '#CCCCCC',
        'primary-red': '#fe0007',
        'secondary-yellow': '#fdfd01',
        'card': '#141416',
        'border-color': '#262626',
        'instagram': '#E4405F',
        'facebook': '#1877F2',
        'whatsapp': '#25D366',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'display': ['Bebas Neue', 'sans-serif'],
      },
      boxShadow: {
        'red': '0 0 40px rgba(254, 0, 7, 0.3)',
        'yellow': '0 0 40px rgba(253, 253, 1, 0.2)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)', 
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
            '0%': { opacity: '0', transform: 'translateY(100%)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastOut: {
            '0%': { opacity: '1', transform: 'translateY(0)' },
            '100%': { opacity: '0', transform: 'translateY(100%)' },
        },
        'hero-image-load': {
            '0%': { 
                opacity: '0', 
                transform: 'translateY(10px) scale(1.15)'
            },
            '15%': { 
                opacity: '1',
                transform: 'translateY(0) scale(1.15)'
            },
            '100%': { 
                opacity: '1', 
                transform: 'translateY(0) scale(1.05)'
            }
        },
        fadeLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
            '0%': { opacity: '0', transform: 'translateY(30px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
            '0%': { opacity: '0', transform: 'scale(0.95)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scrollLogos: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }, 
        },
        scrollLogosReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' }, 
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'toast-in': 'toastIn 0.3s ease-out forwards',
        'toast-out': 'toastOut 0.3s ease-in forwards 2.7s',
        'hero-image-load': 'hero-image-load 8s ease-out forwards',
        'fade-left': 'fadeLeft 0.6s ease-out forwards',
        'fade-right': 'fadeRight 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'zoom-in': 'zoomIn 0.3s ease-out forwards', 
        'scroll-logos': 'scrollLogos 60s linear infinite', 
        'scroll-logos-reverse': 'scrollLogosReverse 60s linear infinite',
      }
    },
  },
}