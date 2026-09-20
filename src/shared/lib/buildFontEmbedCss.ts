type CodeRange = [from: number, to: number];

const SOURCE_URL_PATTERN = /url\((['"]?)([^'")]+)\1\)/;
const UNICODE_RANGE_PREFIX_LENGTH = 2;
const HEX_RADIX = 16;

function parseUnicodeRange(value: string): CodeRange[] | null {
	if (value === "") {
		return null;
	}

	return value.split(",").map((token) => {
		const hex = token.trim().slice(UNICODE_RANGE_PREFIX_LENGTH);

		if (hex.includes("-")) {
			const [from, to] = hex.split("-");
			return [Number.parseInt(from, HEX_RADIX), Number.parseInt(to, HEX_RADIX)];
		}

		if (hex.includes("?")) {
			return [
				Number.parseInt(hex.replaceAll("?", "0"), HEX_RADIX),
				Number.parseInt(hex.replaceAll("?", "F"), HEX_RADIX)
			];
		}

		const code = Number.parseInt(hex, HEX_RADIX);
		return [code, code];
	});
}

function collectFontFaceRules() {
	return [...document.styleSheets]
		.flatMap((sheet) => {
			try {
				return [...sheet.cssRules];
			} catch {
				return [];
			}
		})
		.filter((rule) => rule instanceof CSSFontFaceRule);
}

function toCodePoints(text: string) {
	const codePoints = new Set<number>();

	for (const char of text) {
		const code = char.codePointAt(0);

		if (code !== undefined) {
			codePoints.add(code);
		}
	}

	return codePoints;
}

function coversAny(rule: CSSFontFaceRule, codePoints: Set<number>) {
	const ranges = parseUnicodeRange(rule.style.getPropertyValue("unicode-range"));

	if (ranges === null) {
		return true;
	}

	for (const code of codePoints) {
		if (ranges.some(([from, to]) => code >= from && code <= to)) {
			return true;
		}
	}

	return false;
}

async function toDataUrl(url: string) {
	const response = await fetch(url);
	const blob = await response.blob();

	return await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => resolve(String(reader.result)));
		reader.addEventListener("error", () => reject(reader.error));
		reader.readAsDataURL(blob);
	});
}

async function toEmbeddedRule(rule: CSSFontFaceRule) {
	const match = SOURCE_URL_PATTERN.exec(rule.style.getPropertyValue("src"));

	if (match === null) {
		return null;
	}

	const source = match[2];

	try {
		const dataUrl = await toDataUrl(new URL(source, document.baseURI).href);
		return rule.cssText.replace(source, dataUrl);
	} catch {
		return null;
	}
}

export async function buildFontEmbedCss(node: HTMLElement) {
	const codePoints = toCodePoints(node.textContent ?? "");
	const rules = collectFontFaceRules().filter((rule) => coversAny(rule, codePoints));
	const blocks = await Promise.all(rules.map(toEmbeddedRule));

	return blocks.filter((block) => block !== null).join("\n");
}
