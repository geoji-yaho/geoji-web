const MISSING_API_BASE_URL = "VITE_API_BASE_URL 환경 변수가 없습니다. .env.example을 보고 .env.local을 만드세요";

function readApiBaseUrl() {
	const value = import.meta.env.VITE_API_BASE_URL;
	if (!value) {
		throw new Error(MISSING_API_BASE_URL);
	}

	return value.replace(/\/+$/, "");
}

export const env = {
	get apiBaseUrl() {
		return readApiBaseUrl();
	}
};
