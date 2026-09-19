import { useMemo, useSyncExternalStore } from "react";

const TICK_INTERVAL_MS = 15_000;

const listeners = new Set<() => void>();
let timerId: ReturnType<typeof setInterval> | null = null;

function notifyListeners() {
	listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
	listeners.add(listener);

	if (timerId === null) {
		timerId = setInterval(notifyListeners, TICK_INTERVAL_MS);
	}

	return () => {
		listeners.delete(listener);

		if (listeners.size === 0 && timerId !== null) {
			clearInterval(timerId);
			timerId = null;
		}
	};
}

function getSnapshot() {
	return Math.floor(Date.now() / TICK_INTERVAL_MS) * TICK_INTERVAL_MS;
}

export function useNow() {
	const nowMs = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return useMemo(() => new Date(nowMs), [nowMs]);
}
