import { cn } from "../lib/cn";

type LogoIconProps = {
	className?: string;
};

/** 엽전 주머니 아이콘. 색은 브랜드 팔레트라 테마를 따라가지 않는다 */
export function LogoIcon({ className }: LogoIconProps) {
	return (
		<svg viewBox="0 0 120 120" aria-hidden="true" className={cn("size-11 shrink-0", className)}>
			<path
				d="M44 42 C32 52 24 66 24 80 C24 98 40 108 60 108 C80 108 96 98 96 80 C96 66 88 52 76 42 Z"
				fill="#cfa96e"
				stroke="#5C4028"
				strokeWidth={5}
				strokeLinejoin="round"
			/>
			<path
				d="M44 42 C42 30 48 22 54 24 C56 16 64 16 66 24 C72 22 78 30 76 42 Z"
				fill="#cfa96e"
				stroke="#5C4028"
				strokeWidth={5}
				strokeLinejoin="round"
			/>
			<rect x="39" y="37" width="42" height="10" rx="5" fill="#8C6239" stroke="#5C4028" strokeWidth={3} />
			<g transform="rotate(10 74 84)">
				<rect x="62" y="74" width="24" height="20" rx="5" fill="#B9834A" />
				<rect
					x="65.5"
					y="77.5"
					width="17"
					height="13"
					rx="3"
					fill="none"
					stroke="#5C4028"
					strokeWidth={2}
					strokeDasharray="4 3.5"
				/>
			</g>
			<path d="M36 66 l7 7 M43 66 l-7 7" stroke="#5C4028" strokeWidth={2.5} strokeLinecap="round" />
			<g transform="rotate(-12 84 32)">
				<circle cx="84" cy="32" r="15" fill="#f5d95c" stroke="#5C4028" strokeWidth={4.5} />
				<rect x="79" y="27" width="10" height="10" rx="2" fill="#5C4028" />
			</g>
			<path d="M100 12 l6 -5 M107 28 l8 -2" stroke="#5C4028" strokeWidth={3} strokeLinecap="round" />
		</svg>
	);
}

const WORDMARK_STYLES = {
	header: "text-wordmark",
	display: "text-display"
} as const;

const ICON_STYLES = {
	header: "size-7.5",
	display: "size-13"
} as const;

const TONE_STYLES = {
	ink: "text-ink",
	light: "text-stamp-text"
} as const;

type LogoProps = {
	size?: keyof typeof WORDMARK_STYLES;
	tone?: keyof typeof TONE_STYLES;
	className?: string;
};

/** 아이콘과 워드마크 떼거지를 가로로 놓는다. tone light는 테라코타 바탕용 */
export function Logo({ size = "header", tone = "ink", className }: LogoProps) {
	return (
		<span className={cn("inline-flex items-center gap-2", className)}>
			<LogoIcon className={ICON_STYLES[size]} />
			<span className={cn(WORDMARK_STYLES[size], TONE_STYLES[tone])}>떼거지</span>
		</span>
	);
}
