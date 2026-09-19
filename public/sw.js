const CACHE_PREFIX = "ttegeoji-app-shell-";
const CACHE_VERSION = "v2";
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;

const STATIC_ASSET_PATTERN = /\.(?:css|js|png|jpg|jpeg|svg|webp|ico|woff|woff2|webmanifest)$/;
const HASHED_ASSET_DIR = "assets/";
const CACHEABLE_STATUS = 200;

function getShellUrl() {
	return new URL(self.registration.scope).href;
}

function getHashedAssetPrefix() {
	return new URL(HASHED_ASSET_DIR, self.registration.scope).pathname;
}

async function openCache() {
	try {
		return await caches.open(CACHE_NAME);
	} catch {
		return null;
	}
}

async function readCache(request) {
	const cache = await openCache();
	if (cache === null) {
		return undefined;
	}

	try {
		return await cache.match(request);
	} catch {
		return undefined;
	}
}

function writeCacheLater(event, request, response) {
	if (response.status !== CACHEABLE_STATUS) {
		return;
	}

	const copy = response.clone();

	event.waitUntil(
		openCache().then((cache) => {
			if (cache === null) {
				return undefined;
			}

			return cache.put(request, copy).catch(() => undefined);
		})
	);
}

async function removeOldCaches() {
	const names = await caches.keys();
	const stale = names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME);

	await Promise.all(stale.map((name) => caches.delete(name)));
}

async function handleNavigate(event) {
	const shellUrl = getShellUrl();

	try {
		const response = await fetch(event.request);
		if (event.request.url === shellUrl) {
			writeCacheLater(event, shellUrl, response);
		}

		return response;
	} catch (error) {
		const cached = await readCache(shellUrl);
		if (cached) {
			return cached;
		}

		throw error;
	}
}

async function handleHashedAsset(event) {
	const cached = await readCache(event.request);
	if (cached) {
		return cached;
	}

	const response = await fetch(event.request);
	writeCacheLater(event, event.request, response);

	return response;
}

async function handleUnhashedAsset(event) {
	try {
		const response = await fetch(event.request);
		writeCacheLater(event, event.request, response);

		return response;
	} catch (error) {
		const cached = await readCache(event.request);
		if (cached) {
			return cached;
		}

		throw error;
	}
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
		event.respondWith(handleNavigate(event));
		return;
	}

	const url = new URL(request.url);
	if (url.origin !== self.location.origin || !STATIC_ASSET_PATTERN.test(url.pathname)) {
		return;
	}

	if (url.pathname.startsWith(getHashedAssetPrefix())) {
		event.respondWith(handleHashedAsset(event));
		return;
	}

	event.respondWith(handleUnhashedAsset(event));
});
