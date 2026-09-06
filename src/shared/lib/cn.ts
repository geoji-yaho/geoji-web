import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * globals.css의 @theme에 추가한 토큰 이름이다. tailwind-merge는 CSS를 읽지 않아서
 * 여기 적지 않으면 text-title을 글자색으로 오인해 text-ink와 충돌시킨다.
 * 토큰을 추가하면 이 목록에도 넣는다.
 */
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
			shadow: ["card", "stamp", "fab", "cta"]
		}
	}
});

/** Tailwind 클래스를 조건부로 합치고 충돌하는 유틸리티는 뒤에 온 것으로 정리한다 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
