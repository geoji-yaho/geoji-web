import { toAppPath } from "./base-path";

const STORAGE_KEY = "geoji.auth.path-after-login";
const LOGIN_PATH = "/login";

function isReturnablePath(path: string) {
	return path.startsWith("/") && !path.startsWith("//") && !path.startsWith(LOGIN_PATH);
}

export function setPathAfterLogin(path: string) {
	const appPath = toAppPath(path);

	if (!isReturnablePath(appPath)) {
		return;
	}

	try {
		if (sessionStorage.getItem(STORAGE_KEY) !== null) {
			return;
		}

		sessionStorage.setItem(STORAGE_KEY, appPath);
	} catch {
		return;
	}
}

export function takePathAfterLogin() {
	try {
		const saved = sessionStorage.getItem(STORAGE_KEY);
		sessionStorage.removeItem(STORAGE_KEY);

		if (saved === null) {
			return null;
		}

		const appPath = toAppPath(saved);

		return isReturnablePath(appPath) ? appPath : null;
	} catch {
		return null;
	}
}
