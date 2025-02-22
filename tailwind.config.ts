import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#FDEC2D',
				secondary: '#00FFFF',
				tertiary: '#8C53EF',
				blueGreen: '#00FFFF',
				pinky: '#FA96C6',
				lightRed: '#ff4b4b',
				neonGreen: '#B8FA2C'
			},
		},
	},
	plugins: [],
};
export default config;
