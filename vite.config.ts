import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const VENDOR_CHUNKS: Record<string, RegExp> = {
	react: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
	motion: /[\\/]node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/,
	router: /[\\/]node_modules[\\/]react-router[\\/]/
};

const DEV_ONLY_ENV_KEYS = ["VITE_DEV_ACCESS_TOKEN", "VITE_DEV_NICKNAME"];

function dropDevOnlyEnv() {
	return Object.fromEntries(DEV_ONLY_ENV_KEYS.map((key) => [`import.meta.env.${key}`, "undefined"]));
}

export default defineConfig(({ command }) => ({
	base: command === "build" ? "/geoji-web/" : "/",
	define: command === "build" ? dropDevOnlyEnv() : {},
	plugins: [react(), tailwindcss()],
	resolve: {
		tsconfigPaths: true
	},
	build: {
		rolldownOptions: {
			output: {
				manualChunks: (id) => {
					if (!id.includes("node_modules")) {
						return undefined;
					}
					const name = Object.keys(VENDOR_CHUNKS).find((key) => VENDOR_CHUNKS[key].test(id));
					return name ?? "vendor";
				}
			}
		}
	},
	server: {
		port: 3800,
		watch: {
			ignored: ["**/.agents/**", "**/.claude/**", "**/.codex/**", "**/.omc/**"]
		}
	}
}));
