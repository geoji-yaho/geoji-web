import { ExecutionMeter } from "@/shared/components/ExecutionMeter";
import { TierBadge } from "@/shared/components/TierBadge";
import { TierTrack } from "@/shared/components/TierTrack";
import type { Tier } from "@/shared/domain/tier";
import type { Imprisonment } from "@/shared/domain/verdict";
import { cn } from "@/shared/lib/cn";
import { AnimatedAmount } from "@/shared/ui/AnimatedAmount";
import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";
import { MeterBar } from "@/shared/ui/MeterBar";
import { formatAmount } from "@/shared/utils/format";

type ProfileSummaryCardProps = {
	name: string;
	imageUrl?: string | null;
	tier: Tier;
	nextTierLabel: string;
	score: number;
	monthLabel: string;
	spent: number;
	budget: number;
	baseline?: number;
	noSpendDays?: number;
	imprisonment?: Imprisonment;
	className?: string;
};

export function ProfileSummaryCard({
	name,
	imageUrl,
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
	const hasStats = noSpendDays !== undefined || imprisonment !== undefined;

	return (
		<Card className={cn("flex flex-col gap-3.5 p-4.5", className)}>
			<div className="flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2.5">
					<Avatar name={name} src={imageUrl} size="lg" />
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

			<TierTrack tier={tier} />
			<div aria-hidden="true" className="h-px bg-line" />

			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between text-xs text-mute">
					<span>{monthLabel}</span>
					<span className={overBudget ? "font-black text-red" : undefined}>
						<AnimatedAmount value={spent} /> / {formatAmount(budget)}원{overBudget && " 초과"}
					</span>
				</div>
				<MeterBar value={spent} max={budget} tone={overBudget ? "red" : "cta"} markerValue={baseline} />
			</div>

			{hasStats && (
				<div className="flex gap-2">
					{noSpendDays !== undefined && (
						<div className="flex-1 rounded-xl bg-fill px-3 py-2.5">
							<span className="text-caption text-mute">무지출</span>
							<p className="text-title text-ink">{noSpendDays}일</p>
						</div>
					)}
					{imprisonment !== undefined && (
						<div className="flex flex-1 flex-col gap-1.5 rounded-xl bg-red/10 px-3 py-2.5">
							<div className="flex items-center justify-between text-caption text-red">
								<span className="font-extrabold">수감 중</span>
								<span className="font-black">D-{imprisonment.daysLeft}</span>
							</div>
							<ExecutionMeter {...imprisonment} />
						</div>
					)}
				</div>
			)}
		</Card>
	);
}
