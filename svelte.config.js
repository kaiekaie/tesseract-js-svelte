import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';
import { dirname, resolve } from 'path';

import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();
const __dirname = dirname(fileURLToPath(import.meta.url));

const svelteConfig = {
	preprocess: preprocess({
		postcss: true,
		replace: [['process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV)]]
	}),

	kit: {
		files: {
			assets: 'public'
		},
		vite: {
			resolve: {
				alias: {
					$app: resolve(__dirname, './src')
				}
			}
		},

		adapter: node()
	}
};

export default svelteConfig;
