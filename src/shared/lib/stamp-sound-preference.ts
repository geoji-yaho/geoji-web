const STORAGE_KEY = "geoji.verdict.sound-off";
const OFF = "true";

export function isStampSoundOn() {
	try {
		return localStorage.getItem(STORAGE_KEY) !== OFF;
	} catch {
		return true;
	}
}

export function setStampSoundOn(on: boolean) {
	try {
		if (on) {
			localStorage.removeItem(STORAGE_KEY);
			return;
		}

		localStorage.setItem(STORAGE_KEY, OFF);
	} catch {
		return;
	}
}
