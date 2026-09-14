export type ShareInput = {
	title: string;
	text: string;
	url: string;
};

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
