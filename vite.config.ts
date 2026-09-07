import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const VENDOR_CHUNKS: Record<string, RegExp> = {
	react: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
	motion: /[\\/]node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/,
	router: /[\\/]node_modules[\\/]react-router[\\/]/
};

export default defineConfig(({ command }) => ({
	base: command === "build" ? "/geoji-web/" : "/",
	plugins: [react(), tailwindcss()],
	resolve: {
		tsconfigPaths: true
	},
	build: {
		rolldownOptions: {
			output: {
				manualChunks: (id) => {
					if (!id.includes("node_modules")) return undefined;
					const name = Object.keys(VENDOR_CHUNKS).find((key) => VENDOR_CHUNKS[key].test(id));
					return name ?? "vendor";
				}
			}
		}
	},
	server: {
		port: 3800,
		watch: {
			ignored: ["**/.agents/**", "**/.claude/**", "**/.omc/**"]
		}
	}
}));
