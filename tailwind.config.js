/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    textShadow: {
      'sm': '0 4px 6px rgba(0, 0, 0, 0.25)',
      'sm2': '0 4px 6px rgba(0, 0, 0, 0.12)',
    },
    extend: {
      backgroundImage: {
        'primary-gradient': 'linear-gradient(103.58deg, #00F0EC 15.1%, #16FFC5 87.92%)',
        'like-gradient': 'linear-gradient(103.58deg, #FA16FF 15.1%, #F00056 87.92%)',
        'border-gradient': 'linear-gradient(to right, #161616, #161616), linear-gradient(103.58deg, #00F0EC 15.1%, #16FFC5 87.92%)',
        'rainbow-gradient': 'linear-gradient(103.58deg, #8600F0 15.1%, #008BF0 40.13%, #00F0EC 63.65%, #16FFC5 87.92%)',
        'dark-gradient': 'linear-gradient(120.31deg, rgba(125, 125, 125, 0.2) 20%, rgba(125, 125, 125, 0.06) 85.18%)',
        'fire-gradient': 'linear-gradient(224.6deg, #FFA216 0.01%, #FF1616 100.09%)'
      },
      colors: {
        l: {
          50:  '#F6F8FC',
          100: '#ffaa85',
          200: '#ff7658',
          300: '#FC4F37',
          400: '#c91812',
          500: '#990101',
          600: '#690000',
        },
        primary: '#161616',
        'primary-light': '#F5F5F5',
        secondary: '#969696',
        'dark-green': '#38B000',
        'dark-red': '#E84142',
        'primary-blue': '#00F0EC',
        'primary-green': '#16FFC5'
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        mono: ['Inconsolata', ...fontFamily.mono],
        RetniSans:['RetniSans']
      },
      fontSize: {
        xs: ['10px', '12px'],
        sm: ['12px', '14px'],
        md: ['15px', '18px'],
        lg: ['16px', '19px'],
        xg: ['18px', '22px'],
        xl: ['20px', '24px'],
        xg1:['24px', '29px'],
        xg2:['28px', '34px'],
        xxl: ['30px', '36px'],
        xxxl: ['32px', '38px'],
        xl2: ['40px', '48px'],
        xl3: ['48px', '58px'],
        xxl2: '60px',
        extraxl: ['64px', '77px']
      },
      gridTemplateRows: {
        '7': 'repeat(7, minmax(0, 1fr))',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      rotate: {
        '52': '52deg',
      },
      boxShadow:{
        'ml':'0 0 10px rgba(0,0,0,0.25)'
      },
      aspectRatio: {
        '3/1': '3 / 1',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-textshadow')],
}
