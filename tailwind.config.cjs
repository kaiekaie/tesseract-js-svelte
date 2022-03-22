const plugin = require('tailwindcss/plugin');
const Color = require('color');

module.exports = {
	mode: 'jit',
	darkMode: 'media',
	content: ['./src/**/*.{html,js,svelte}'],
	plugins: [
		require('@tailwindcss/custom-forms'),
		plugin(function ({ addUtilities }) {
			const newUtilities = {
				'.remove-blink': {
					'-webkit-tap-highlight-color': 'transparent'
				}
			};

			addUtilities(newUtilities, ['responsive', 'hover']);
		})
	],
	theme: {
		extend: {
			zIndex: { '-10': '-10' },
			minWidth: { 250: '250px' },
			gridTemplateColumns: {
				'grid-fit': 'repeat(auto-fit, minmax(150px, 1fr))'
			}
		}
	},

	variants: {
		backgroundColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
		textColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
		fontSize: ['responsive', 'hover'],
		animation: ['hover', 'focus', 'active']
	}
};
