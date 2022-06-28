const defaultConfig = require('tailwindcss/defaultConfig')
const formsPlugin = require('@tailwindcss/forms')
const typographyPlugin = require('@tailwindcss/typography')
const daisyUIPlugin = require('daisyui')

module.exports = {
  content: ['index.html', 'src/**/*.tsx'],
  theme: {
    colors: {
      dark: '#242f3e',
      darkish: '#17263c',
      background: '#17263c',
      blueGlassAlpha: "rgba(120,169,227,0.3)",
      greenGlassAlpha: "rgba(38,52,20,0.7)",
      white: '#ffffff',
      blue: {
        50: "#EAF2FB",
        100: "#C4D9F3",
        200: "#9EC1EB",
        300: "#78A9E3",
        400: "#5291DB",
        500: "#2C79D3",
        600: "#2361A9",
        700: "#1B487E",
        800: "#123054",
        900: "#09182A"
      },
      gray: {
        50: "#EFF2F6",
        100: "#D2DAE5",
        200: "#B5C2D4",
        300: "#98AAC3",
        400: "#7B92B2",
        500: "#5E7AA1",
        600: "#4B6281",
        700: "#384961",
        800: "#253141",
        900: "#131820"
      },
      green: {
        50: "#F3F8ED",
        100: "#DEEBCC",
        200: "#C8DEAB",
        300: "#B3D18A",
        400: "#9EC469",
        500: "#88B748",
        600: "#6D923A",
        700: "#526E2B",
        800: "#37491D",
        900: "#1B250E"
      },
    },
    fontFamily: {
      sans: ['"Exo 2"', 'sans-serif'],
      serif: ['serif'],
    }
  },
  daisyui: {
    themes: {
      light: {
        "primary": '#6D923A',
      },
      dark: {
        "primary": '#6D923A',
      }
    }
  },
  experimental: { optimizeUniversalDefaults: true },
  plugins: [formsPlugin, typographyPlugin, daisyUIPlugin]
}