const MISSING_API_BASE_URL = "VITE_API_BASE_URL 환경 변수가 없습니다. .env.example을 보고 .env.local을 만드세요";
const MIXED_CONTENT =
	"https 페이지에서 http 서버를 부를 수 없습니다. 백엔드가 HTTPS를 지원해야 배포 환경에서 동작합니다";
const MISSING_SUPABASE_URL = "VITE_SUPABASE_URL 환경 변수가 없습니다. .env.example을 보고 .env.local을 만드세요";
const MISSING_SUPABASE_ANON_KEY =
	"VITE_SUPABASE_ANON_KEY 환경 변수가 없습니다. .env.example을 보고 .env.local을 만드세요";

function readApiBaseUrl() {
	const value = import.meta.env.VITE_API_BASE_URL;
	if (!value) {
		throw new Error(MISSING_API_BASE_URL);
	}

	if (window.location.protocol === "https:" && value.startsWith("http:")) {
		throw new Error(MIXED_CONTENT);
	}

	return value.replace(/\/+$/, "");
}

function readSupabaseUrl() {
	const value = import.meta.env.VITE_SUPABASE_URL;
	if (!value) {
		throw new Error(MISSING_SUPABASE_URL);
	}

	return value;
}

function readSupabaseAnonKey() {
	const value = import.meta.env.VITE_SUPABASE_ANON_KEY;
	if (!value) {
		throw new Error(MISSING_SUPABASE_ANON_KEY);
	}

	return value;
}

function readDevValue(value: string | undefined) {
	if (!import.meta.env.DEV) {
		return null;
	}

	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
}

export const env = {
	get apiBaseUrl() {
		return readApiBaseUrl();
	},
	get supabaseUrl() {
		return readSupabaseUrl();
	},
	get supabaseAnonKey() {
		return readSupabaseAnonKey();
	},
	get devAccessToken() {
		return readDevValue(import.meta.env.VITE_DEV_ACCESS_TOKEN);
	},
	get devNickname() {
		return readDevValue(import.meta.env.VITE_DEV_NICKNAME);
	}
};
