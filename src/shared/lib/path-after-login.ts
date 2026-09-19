const STORAGE_KEY = "geoji.auth.path-after-login";
const LOGIN_PATH = "/login";

function getBasename() {
	return import.meta.env.BASE_URL.replace(/\/$/, "");
}

function toAppPath(path: string) {
	const basename = getBasename();

	if (basename === "") {
		return path;
	}

	let stripped = path;

	while (stripped === basename || stripped.startsWith(`${basename}/`)) {
		stripped = stripped.slice(basename.length);
	}

	return stripped === "" ? "/" : stripped;
}

function isReturnablePath(path: string) {
	return path.startsWith("/") && !path.startsWith("//") && !path.startsWith(LOGIN_PATH);
}

export function setPathAfterLogin(path: string) {
	const appPath = toAppPath(path);

	if (!isReturnablePath(appPath)) {
		return;
	}

	try {
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
