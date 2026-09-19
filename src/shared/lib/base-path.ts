export function getBasename() {
	return import.meta.env.BASE_URL.replace(/\/$/, "");
}

export function toAppPath(path: string) {
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

export function toAbsoluteUrl(path: string) {
	return `${globalThis.location.origin}${getBasename()}${path}`;
}
