import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";
import type { Imprisonment, VoteTally } from "../types/verdict";

const TRACK_STYLES = "w-full overflow-hidden rounded-full bg-page";

const meterBarVariants = cva(`relative ${TRACK_STYLES}`, {
	variants: {
		size: {
			md: "h-2",
			sm: "h-1.5"
		}
	},
	defaultVariants: {
		size: "md"
	}
});

const METER_FILL_STYLES = {
	cta: "bg-cta",
	red: "bg-red"
} as const;

type MeterBarProps = VariantProps<typeof meterBarVariants> & {
	value: number;
	max: number;
	/** 예산 게이지는 cta, 형 집행 게이지는 red */
	tone?: keyof typeof METER_FILL_STYLES;
	/** 기준선을 그을 값. 예산 게이지의 경과일 기준선 */
	markerValue?: number;
	className?: string;
};

function toPercent(value: number, max: number) {
	return max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
}

export function MeterBar({ value, max, tone = "cta", size, markerValue, className }: MeterBarProps) {
	return (
		<div
			role="meter"
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={max}
			className={cn(meterBarVariants({ size }), className)}
		>
			<span
				className={cn("block h-full rounded-full", METER_FILL_STYLES[tone])}
				style={{ width: `${toPercent(value, max)}%` }}
			/>
			{markerValue !== undefined && (
				<span
					aria-hidden="true"
					className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-ink"
					style={{ left: `${toPercent(markerValue, max)}%` }}
				/>
			)}
		</div>
	);
}

type SplitBarProps = {
	/** 유죄 또는 기각 표. 테라코타 */
	leftValue: number;
	/** 무죄 또는 동의 표. 그린 */
	rightValue: number;
	className?: string;
};

export function SplitBar({ leftValue, rightValue, className }: SplitBarProps) {
	const total = leftValue + rightValue;
	const leftPercent = toPercent(leftValue, total);
	const rightPercent = total > 0 ? 100 - leftPercent : 0;

	return (
		<div className={cn("flex h-2", TRACK_STYLES, className)}>
			<span className="h-full bg-red" style={{ width: `${leftPercent}%` }} />
			<span className="h-full bg-green" style={{ width: `${rightPercent}%` }} />
		</div>
	);
}

type TallyRowProps = {
	tally: VoteTally;
	opposeLabel: string;
	supportLabel: string;
	className?: string;
};

/** 집계 바와 양쪽 표 수. 지출 카드와 판결 블록이 같이 쓴다 */
export function TallyRow({ tally, opposeLabel, supportLabel, className }: TallyRowProps) {
	return (
		<div className={cn("flex items-center gap-2.5", className)}>
			<SplitBar leftValue={tally.oppose} rightValue={tally.support} className="flex-1" />
			<span className="shrink-0 text-xs font-black text-red">
				{opposeLabel} {tally.oppose}
			</span>
			<span className="shrink-0 text-xs font-black text-green">
				{supportLabel} {tally.support}
			</span>
		</div>
	);
}

type ExecutionMeterProps = Imprisonment & {
	className?: string;
};

/** 형 집행 게이지. 복역한 날이 채워진다 */
export function ExecutionMeter({ daysLeft, totalDays, className }: ExecutionMeterProps) {
	return <MeterBar value={totalDays - daysLeft} max={totalDays} tone="red" size="sm" className={className} />;
}
