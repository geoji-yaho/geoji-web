import { Avatar } from "./Avatar";
import { TagBadge } from "./Badge";
import { MeterBar } from "./ProgressBar";

type ProfileSummaryCardProps = {
	name: string;
	tier: string;
	scoreLabel: string;
	scoreValue: number;
	nextTierLabel: string;
	monthLabel: string;
	spent: number;
	budget: number;
	noSpendDaysLabel: string;
	sentenceStatusLabel: string;
	sentenceValue: number;
	sentenceMax: number;
};

export function ProfileSummaryCard({
	name,
	tier,
	scoreValue,
	nextTierLabel,
	monthLabel,
	spent,
	budget,
	noSpendDaysLabel,
	sentenceStatusLabel,
	sentenceValue,
	sentenceMax
}: ProfileSummaryCardProps) {
	return (
		<div className="flex flex-col gap-4 rounded-2xl bg-card p-4">
			<div className="flex items-start gap-3">
				<Avatar label={name.slice(0, 1)} size="lg" highlighted />
				<div className="flex-1">
					<div className="flex items-center gap-1.5">
						<span className="font-bold text-ink">{name}</span>
						<TagBadge label={tier} />
					</div>
					<span className="text-xs text-muted">{nextTierLabel}</span>
				</div>
				<span className="text-2xl font-black text-terracotta">{scoreValue}</span>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted">{monthLabel}</span>
					<span className="font-bold text-ink">
						{spent.toLocaleString("ko-KR")} / {budget.toLocaleString("ko-KR")}원
					</span>
				</div>
				<MeterBar value={spent} max={budget} tone="gold" />
			</div>

			<div className="flex gap-2">
				<div className="flex-1 rounded-xl bg-line p-3">
					<span className="text-xs text-muted">무지출</span>
					<p className="text-lg font-black text-ink">{noSpendDaysLabel}</p>
				</div>
				<div className="flex-1 rounded-xl bg-terracotta-soft p-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-terracotta">{sentenceStatusLabel}</span>
						<span className="text-xs text-terracotta">D-{sentenceMax - sentenceValue}</span>
					</div>
					<div className="mt-2">
						<MeterBar value={sentenceValue} max={sentenceMax} tone="terracotta" />
					</div>
				</div>
			</div>
		</div>
	);
}
