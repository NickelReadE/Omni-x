/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'primary-gradient': 'linear-gradient(103.58deg, #00F0EC 15.1%, #16FFC5 87.92%)',
        'border-gradient': 'linear-gradient(to right, #161616, #161616), linear-gradient(103.58deg, #00F0EC 15.1%, #16FFC5 87.92%)',
        'rainbow-gradient': 'linear-gradient(103.58deg, #8600F0 15.1%, #008BF0 40.13%, #00F0EC 63.65%, #16FFC5 87.92%)',
        'dark-gradient': 'linear-gradient(120.31deg, rgba(125, 125, 125, 0.2) 20%, rgba(125, 125, 125, 0.06) 85.18%)'
      },
      spacing: {
        84: '21rem',
      },
      colors: {
        w:{
          600:'#FEFEFF'
        },
        b: {
          100: '#BFCEFF',
          200: '#90A9FF',
          300: '#5E80F6',
          400: '#3448FF',
          500: '#0c2cdc',
          600: '#0004a5',
        },
        bt: {
          100: '#F5F6FF',
          200: '#EDEFFF',
          300: '#E1E4FF',
        },
        g: {
          100: '#61E979',
          200: '#E9ECEF',
          300: '#495057',
          400: '#ADB5BD',
          600: '#6C757D',
        },
        gr: {
          100: '#38B000',
        },
        l: {
          50:  '#F6F8FC',
          100: '#ffaa85',
          200: '#ff7658',
          300: '#FC4F37',
          400: '#c91812',
          500: '#990101',
          600: '#690000',
        },
        n: {
          100: '#c2c6d2',
          200: '#989ca7',
          300: '#70747e',
          400: '#4a4e57',
          500: '#272b34',
          600: '#010613',
        },
        p: {
          100: '#ffcfff',
          200: '#da9dfd',
          300: '#AC73E7',
          400: '#824DBD',
          500: '#5a2895',
          600: '#31006e',
          700: '#B444F9',
        },
        y: {
          100: '#f5e33e',
          200: '#c7b902',
        },
        primary: '#161616',
        'primary-light': '#F5F5F5',
        secondary: '#969696',
        'dark-green': '#38B000',
        'primary-blue': '#00F0EC',
        'primary-green': '#16FFC5'
        // gradient: 'linear-gradient(103.58deg, #00F0EC 15.1%, #16FFC5 87.92%)',
        // rainbow: 'linear-gradient(103.58deg, #8600F0 15.1%, #008BF0 40.13%, #00F0EC 63.65%, #16FFC5 87.92%)',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        mono: ['Inconsolata', ...fontFamily.mono],
        RetniSans:['RetniSans']
      },
      fontSize: {
        xs: '10px',
        sm: '12px',
        md: ['15px', '18px'],
        lg: ['16px', '19px'],
        xg: ['18px', '22px'],
        xl: ['20px', '24px'],
        xg1:['24px', '29px'],
        xl2:'40px',
        xxl:'32px',
        xxl2:'60px',
        extraxl: ['64px', '77px']
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      rotate: {
        '52': '52deg',
      },
      boxShadow:{
        'ml':'0 0 10px rgba(0,0,0,0.25)'
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
