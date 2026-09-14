const STORAGE_KEY = "geoji.onboarding.skipped";
const SKIPPED = "true";

export function isOnboardingSkipped() {
	try {
		return localStorage.getItem(STORAGE_KEY) === SKIPPED;
	} catch {
		return false;
	}
}

export function skipOnboarding() {
	try {
		localStorage.setItem(STORAGE_KEY, SKIPPED);
	} catch {
		return;
	}
}

export function clearOnboardingSkip() {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		return;
	}
}
