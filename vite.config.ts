import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
	plugins: [sveltekit(), nodePolyfills({ protocolImports: true })],
	resolve: {
		alias: { stream: "stream-browserify" },
	},
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: "globalThis",
			},
		},
	},
	build: {
		outDir: "build",
		// used for "Graph" is undefined error with Dagre package https://github.com/vitejs/vite/issues/5759
		commonjsOptions: {
			ignoreTryCatch: false,
		},
	},
});
