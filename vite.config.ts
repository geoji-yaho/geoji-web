import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/geoji-web/",
	plugins: [react(), tailwindcss()],
	server: {
		port: 3800
	}
});
