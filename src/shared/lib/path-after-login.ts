const STORAGE_KEY = "geoji.auth.path-after-login";
const LOGIN_PATH = "/login";

function isReturnablePath(path: string) {
	return path.startsWith("/") && !path.startsWith("//") && !path.startsWith(LOGIN_PATH);
}

export function setPathAfterLogin(path: string) {
	if (!isReturnablePath(path)) {
		return;
	}

	try {
		sessionStorage.setItem(STORAGE_KEY, path);
	} catch {
		return;
	}
}

export function takePathAfterLogin() {
	try {
		const saved = sessionStorage.getItem(STORAGE_KEY);
		sessionStorage.removeItem(STORAGE_KEY);

		return saved !== null && isReturnablePath(saved) ? saved : null;
	} catch {
		return null;
	}
}
