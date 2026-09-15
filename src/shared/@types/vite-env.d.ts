interface ImportMetaEnv {
	readonly VITE_API_BASE_URL?: string;
	readonly VITE_SUPABASE_URL?: string;
	readonly VITE_SUPABASE_ANON_KEY?: string;
	readonly VITE_DEV_ACCESS_TOKEN?: string;
	readonly VITE_DEV_NICKNAME?: string;
	readonly VITE_KAKAO_JS_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
