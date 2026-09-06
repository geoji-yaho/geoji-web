import type { Verdict } from "../types";

const VERDICT_TAG_STYLES: Record<Verdict, string> = {
	승인: "bg-gray-100 text-gray-600",
	기각: "bg-terracotta-soft text-terracotta",
	칭송: "bg-praise-soft text-praise"
};

export function VerdictTag({ verdict }: { verdict: Verdict }) {
	return (
		<span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${VERDICT_TAG_STYLES[verdict]}`}>{verdict}</span>
	);
}

const STAMP_SIZE_STYLES = {
	sm: "size-[54px] text-lg",
	lg: "size-24 text-3xl"
} as const;

const STAMP_TONE_STYLES = {
	reject: "bg-terracotta",
	praise: "bg-praise"
} as const;

type VerdictStampProps = {
	label: string;
	tone?: keyof typeof STAMP_TONE_STYLES;
	size?: keyof typeof STAMP_SIZE_STYLES;
};

export function VerdictStamp({ label, tone = "reject", size = "sm" }: VerdictStampProps) {
	return (
		<span
			className={`flex shrink-0 rotate-[-6deg] items-center justify-center rounded-2xl font-black text-white ${STAMP_TONE_STYLES[tone]} ${STAMP_SIZE_STYLES[size]}`}
		>
			{label}
		</span>
	);
}
