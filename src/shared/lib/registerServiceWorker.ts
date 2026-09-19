const SERVICE_WORKER_FILE = "sw.js";

export function registerServiceWorker() {
	if (import.meta.env.DEV || !("serviceWorker" in navigator)) {
		return;
	}

	const scope = import.meta.env.BASE_URL;

	navigator.serviceWorker.register(`${scope}${SERVICE_WORKER_FILE}`, { scope }).catch(() => undefined);
}
