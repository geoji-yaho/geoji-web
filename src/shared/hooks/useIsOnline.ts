import { useSyncExternalStore } from "react";

function subscribe(listener: () => void) {
	globalThis.addEventListener("online", listener);
	globalThis.addEventListener("offline", listener);

	return () => {
		globalThis.removeEventListener("online", listener);
		globalThis.removeEventListener("offline", listener);
	};
}

function getSnapshot() {
	return navigator.onLine;
}

function getServerSnapshot() {
	return true;
}

export function useIsOnline() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
