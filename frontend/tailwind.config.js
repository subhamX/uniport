module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'nav-color': '#243959',
        'custom-blue-color': '#1565c0'
      },
      fontFamily: {
        body: ['Noto Sans JP']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
