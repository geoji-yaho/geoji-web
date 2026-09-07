import type { ThemePreference } from "@/shared/domain/theme";

export type ResolvedTheme = "light" | "dark";

export type ThemeSnapshot = {
	preference: ThemePreference;
	resolved: ResolvedTheme;
};

const STORAGE_KEY = "ttegeoji-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const LIGHT_MEDIA = "(prefers-color-scheme: light)";
const DARK_MEDIA = DARK_QUERY;
const NEVER_MEDIA = "not all";

const listeners = new Set<() => void>();

let darkQuery: MediaQueryList | null = null;

function getDarkQuery() {
	darkQuery ??= window.matchMedia(DARK_QUERY);
	return darkQuery;
}

function readPreference(): ThemePreference {
	const applied = document.documentElement.dataset.theme;
	return applied === "light" || applied === "dark" ? applied : "system";
}

function resolve(preference: ThemePreference): ResolvedTheme {
	if (preference !== "system") {
		return preference;
	}

	return getDarkQuery().matches ? "dark" : "light";
}

function applyThemeColor(preference: ThemePreference) {
	const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');

	for (const meta of metas) {
		const forDark = meta.dataset.scheme === "dark";

		if (preference === "system") {
			meta.media = forDark ? DARK_MEDIA : LIGHT_MEDIA;
			continue;
		}

		meta.media = (preference === "dark") === forDark ? "" : NEVER_MEDIA;
	}
}

function writeStored(preference: ThemePreference) {
	try {
		if (preference === "system") {
			localStorage.removeItem(STORAGE_KEY);
		} else {
			localStorage.setItem(STORAGE_KEY, preference);
		}
	} catch {
		return;
	}
}

let snapshot: ThemeSnapshot = { preference: "system", resolved: "light" };
let snapshotReady = false;

function refreshSnapshot() {
	const preference = readPreference();
	const resolved = resolve(preference);

	if (snapshotReady && snapshot.preference === preference && snapshot.resolved === resolved) {
		return false;
	}

	snapshot = { preference, resolved };
	snapshotReady = true;
	return true;
}

function emit() {
	for (const listener of listeners) {
		listener();
	}
}

function handleSystemChange() {
	if (refreshSnapshot()) {
		emit();
	}
}

export const themeStore = {
	subscribe(listener: () => void) {
		listeners.add(listener);

		if (listeners.size === 1) {
			getDarkQuery().addEventListener("change", handleSystemChange);
		}

		return () => {
			listeners.delete(listener);

			if (listeners.size === 0) {
				getDarkQuery().removeEventListener("change", handleSystemChange);
			}
		};
	},

	getSnapshot() {
		if (!snapshotReady) {
			refreshSnapshot();
		}

		return snapshot;
	},

	setPreference(next: ThemePreference) {
		if (next === "system") {
			delete document.documentElement.dataset.theme;
		} else {
			document.documentElement.dataset.theme = next;
		}

		applyThemeColor(next);
		writeStored(next);

		if (refreshSnapshot()) {
			emit();
		}
	}
};
