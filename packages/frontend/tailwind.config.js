module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'nav-color': '#243959',
        'custom-blue-color': '#1565c0',
        'side-nav-color': '#f4f5f5',
        'custom-grey': '#333e48',
        'custom-btn-color-bg-active': '#d3d7dd',
        'custom-btn-color-bg-hover': '#e9ebee',
        'custom-scroll-color': '#d6d8da'
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
