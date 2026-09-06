type SplitBarProps = {
	leftValue: number;
	rightValue: number;
};

export function SplitBar({ leftValue, rightValue }: SplitBarProps) {
	const total = leftValue + rightValue || 1;
	const leftPercent = (leftValue / total) * 100;

	return (
		<div className="flex h-2 w-full overflow-hidden rounded-full bg-line">
			<span className="h-full bg-terracotta" style={{ width: `${leftPercent}%` }} />
			<span className="h-full flex-1 bg-praise" />
		</div>
	);
}

const METER_TONE_STYLES = {
	gold: "bg-gold",
	terracotta: "bg-terracotta"
} as const;

type MeterBarProps = {
	value: number;
	max: number;
	tone?: keyof typeof METER_TONE_STYLES;
};

export function MeterBar({ value, max, tone = "gold" }: MeterBarProps) {
	const percent = Math.min(100, (value / max) * 100);

	return (
		<div className="h-2 w-full overflow-hidden rounded-full bg-line">
			<span className={`block h-full rounded-full ${METER_TONE_STYLES[tone]}`} style={{ width: `${percent}%` }} />
		</div>
	);
}
