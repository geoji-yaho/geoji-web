const CACHE_PREFIX = "ttegeoji-app-shell-";
const CACHE_VERSION = "v1";
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;

const STATIC_ASSET_PATTERN = /\.(?:css|js|png|jpg|jpeg|svg|webp|ico|woff|woff2|webmanifest)$/;

function getShellUrl() {
	return new URL(self.registration.scope).href;
}

async function removeOldCaches() {
	const names = await caches.keys();
	const stale = names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME);

	await Promise.all(stale.map((name) => caches.delete(name)));
}

async function handleNavigate(request) {
	const shellUrl = getShellUrl();
	const cache = await caches.open(CACHE_NAME);

	try {
		const response = await fetch(request);
		if (response.status === 200 && request.url === shellUrl) {
			await cache.put(shellUrl, response.clone());
		}

		return response;
	} catch (error) {
		const cached = await cache.match(shellUrl);
		if (cached) {
			return cached;
		}

		throw error;
	}
}

async function handleStaticAsset(request) {
	const cache = await caches.open(CACHE_NAME);
	const cached = await cache.match(request);
	if (cached) {
		return cached;
	}

	const response = await fetch(request);
	if (response.status === 200) {
		await cache.put(request, response.clone());
	}

	return response;
}

self.addEventListener("install", (event) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.add(new Request(getShellUrl(), { cache: "reload" }))));
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(removeOldCaches().then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
	const request = event.request;
	if (request.method !== "GET") {
		return;
	}

	if (request.mode === "navigate") {
		event.respondWith(handleNavigate(request));
		return;
	}

	const url = new URL(request.url);
	if (url.origin !== self.location.origin || !STATIC_ASSET_PATTERN.test(url.pathname)) {
		return;
	}

	event.respondWith(handleStaticAsset(request));
});
