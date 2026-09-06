import { cn } from "../lib/cn";
import type { Tier } from "../types/tier";
import type { Imprisonment } from "../types/verdict";
import { formatAmount } from "../utils/format";
import { Avatar } from "./Avatar";
import { Card } from "./Card";
import { ExecutionMeter, MeterBar } from "./ProgressBar";
import { TierBadge } from "./TierBadge";

type ProfileSummaryCardProps = {
	name: string;
	tier: Tier;
	/** 다음 티어까지 남은 점수 문구. 티어 순서가 미결정이라 계산하지 않고 받는다. 예: 거지왕까지 14점 */
	nextTierLabel: string;
	/** 거지력 0에서 100 */
	score: number;
	monthLabel: string;
	spent: number;
	budget: number;
	/** 기준지출액. 경과일 기준선 위치. 월예산 * 경과일 / 그 달의 일수 */
	baseline: number;
	noSpendDays: number;
	/** 형 집행 중일 때만 넘긴다 */
	imprisonment?: Imprisonment;
	className?: string;
};

export function ProfileSummaryCard({
	name,
	tier,
	nextTierLabel,
	score,
	monthLabel,
	spent,
	budget,
	baseline,
	noSpendDays,
	imprisonment,
	className
}: ProfileSummaryCardProps) {
	const overBudget = spent > budget;

	return (
		<Card className={cn("flex flex-col gap-3.5 p-4.5", className)}>
			<div className="flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2.5">
					<Avatar name={name} size="lg" />
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-1.5">
							<span className="text-base font-black text-ink">{name}</span>
							<TierBadge tier={tier} />
						</div>
						<span className="text-caption text-dim">{nextTierLabel}</span>
					</div>
				</div>
				<div className="shrink-0 text-right">
					<span className="block text-caption text-dim">거지력</span>
					<span className="text-2xl font-black text-red">{score}</span>
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between text-xs text-mute">
					<span>{monthLabel}</span>
					<span className={overBudget ? "font-black text-red" : undefined}>
						{formatAmount(spent)} / {formatAmount(budget)}원{overBudget && " 초과"}
					</span>
				</div>
				<MeterBar value={spent} max={budget} tone={overBudget ? "red" : "cta"} markerValue={baseline} />
			</div>

			<div className="flex gap-2">
				<div className="flex-1 rounded-xl bg-fill px-3 py-2.5">
					<span className="text-caption text-mute">무지출</span>
					<p className="text-title text-ink">{noSpendDays}일</p>
				</div>
				{imprisonment && (
					<div className="flex flex-1 flex-col gap-1.5 rounded-xl bg-red/10 px-3 py-2.5">
						<div className="flex items-center justify-between text-caption text-red">
							<span className="font-extrabold">수감 중</span>
							<span className="font-black">D-{imprisonment.daysLeft}</span>
						</div>
						<ExecutionMeter {...imprisonment} />
					</div>
				)}
			</div>
		</Card>
	);
}
