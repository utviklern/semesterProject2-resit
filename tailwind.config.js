/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pet/**/*.html",
    "./account/**/*.html",
    "./src/**/*.{js,css,html}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A4D5C",
        secondary: "#296E71",
        accent: "#F78A30",
        beige: "#FAF6F0",
        light: "#F5F3EF",
        white: "#FFFFFF"
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      screens: {
        'xs': '400px',
      },
    },
  },
  plugins: [],
}

