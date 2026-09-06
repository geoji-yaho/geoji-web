import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			text: [
				"display",
				"amount",
				"amount-sm",
				"headline",
				"title",
				"subtitle",
				"body",
				"control",
				"chip",
				"label",
				"tag",
				"caption",
				"wordmark",
				"stamp-sm",
				"stamp-md",
				"stamp-lg"
			],
			radius: ["card", "stamp"],
			container: ["phone"],
			ease: ["base"],
			shadow: ["card", "stamp", "fab", "cta"]
		}
	}
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
