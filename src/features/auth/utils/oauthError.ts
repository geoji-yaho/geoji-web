const CANCELLED_CODE = "access_denied";
const ERROR_KEYS = ["error", "error_code", "error_description"];

export type OauthError = {
	isCancelled: boolean;
	description: string | null;
};

function readErrorParams() {
	const fromSearch = new URLSearchParams(globalThis.location.search);

	if (fromSearch.has("error")) {
		return fromSearch;
	}

	const fromHash = new URLSearchParams(globalThis.location.hash.replace(/^#/, ""));

	return fromHash.has("error") ? fromHash : null;
}

function clearErrorFromUrl() {
	const url = new URL(globalThis.location.href);

	url.hash = "";

	for (const key of ERROR_KEYS) {
		url.searchParams.delete(key);
	}

	globalThis.history.replaceState(null, "", url);
}

function captureOauthError() {
	const params = readErrorParams();

	if (params === null) {
		return null;
	}

	const captured: OauthError = {
		isCancelled: params.get("error") === CANCELLED_CODE,
		description: params.get("error_description")
	};

	clearErrorFromUrl();

	return captured;
}

export const oauthError = captureOauthError();
