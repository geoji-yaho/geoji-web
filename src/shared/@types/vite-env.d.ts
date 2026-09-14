interface ImportMetaEnv {
	readonly VITE_API_BASE_URL?: string;
	readonly VITE_DEV_ACCESS_TOKEN?: string;
	readonly VITE_DEV_NICKNAME?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
