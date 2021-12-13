module.exports = {
	mode: 'jit',
	purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			animation: {
				blob: "blob 7s infinite",
			},
			keyframes: {
				blob: {
					"0%": {
						transform: "translate(0px, 0px) scale(1)",
					},
					"33%": {
						transform: "translate(30px, -50px) scale(1.1)",
					},
					"66%": {
						transform: "translate(-20px, 20px) scale(0.9)",
					},
					"100%": {
						transform: "translate(0px, 0px) scale(1)",
					},
				},
			},
			colors: {
				'nav-color': '#243959',
				'custom-blue-color': '#1565c0',
				'side-nav-color': '#f4f5f5',
				'custom-grey': '#333e48',
				'custom-btn-color-bg-active': '#d3d7dd',
				'custom-btn-color-bg-hover': '#e9ebee',
				'custom-scroll-color': '#d6d8da',
				'bg-color': "#fffcee"
			},
			fontFamily: {
				heading: ['Arapey'],
				body: ['Inter']
			},
			fontSize: {
				"xss": '0.55rem'
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
