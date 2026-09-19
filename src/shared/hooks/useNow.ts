import { useSyncExternalStore } from "react";

const TICK_INTERVAL_MS = 15_000;

const listeners = new Set<() => void>();
let timerId: ReturnType<typeof setInterval> | null = null;
let now = new Date();

function tick() {
	now = new Date();
	listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
	listeners.add(listener);

	if (timerId === null) {
		now = new Date();
		timerId = setInterval(tick, TICK_INTERVAL_MS);
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
	return now;
}

export function useNow() {
	return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
