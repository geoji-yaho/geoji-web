import { env } from "./env";

export type ShareInput = {
	title: string;
	text: string;
	url: string;
};

const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js";
const KAKAO_SDK_INTEGRITY = "sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy";

let kakaoSdkPromise: Promise<KakaoSdk | null> | null = null;

function loadKakaoScript() {
	return new Promise<KakaoSdk | null>((resolve) => {
		const script = document.createElement("script");
		script.src = KAKAO_SDK_URL;
		script.integrity = KAKAO_SDK_INTEGRITY;
		script.crossOrigin = "anonymous";
		script.async = true;
		script.addEventListener("load", () => resolve(window.Kakao ?? null));
		script.addEventListener("error", () => {
			script.remove();
			resolve(null);
		});
		document.head.append(script);
	});
}

export function loadKakaoSdk() {
	const appKey = env.kakaoJsKey;
	if (appKey === null) {
		return Promise.resolve(null);
	}

	kakaoSdkPromise ??= loadKakaoScript().then((kakao) => {
		if (kakao === null) {
			kakaoSdkPromise = null;
			return null;
		}

		if (!kakao.isInitialized()) {
			kakao.init(appKey);
		}

		return kakao;
	});

	return kakaoSdkPromise;
}

export async function shareToKakao(input: ShareInput) {
	const kakao = await loadKakaoSdk();
	if (kakao === null) {
		return false;
	}

	try {
		kakao.Share.sendDefault({
			objectType: "text",
			text: input.text,
			link: { mobileWebUrl: input.url, webUrl: input.url }
		});
		return true;
	} catch {
		return false;
	}
}

function isAbortError(error: unknown) {
	return error instanceof DOMException && error.name === "AbortError";
}

export async function copyText(text: string) {
	if (!navigator.clipboard) {
		return false;
	}

	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}

export async function shareContent(input: ShareInput) {
	if (typeof navigator.share === "function") {
		try {
			await navigator.share(input);
			return "shared";
		} catch (error) {
			if (isAbortError(error)) {
				return "cancelled";
			}
		}
	}

	return (await copyText(input.url)) ? "copied" : "failed";
}

export function downloadDataUrl(dataUrl: string, filename: string) {
	const anchor = document.createElement("a");
	anchor.href = dataUrl;
	anchor.download = filename;
	anchor.rel = "noopener";
	document.body.append(anchor);
	anchor.click();
	anchor.remove();
}
