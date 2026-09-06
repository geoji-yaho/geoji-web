import { AnimatedAmount } from "@/shared/ui/AnimatedAmount";
import { Card } from "@/shared/ui/Card";
import { MeterBar } from "@/shared/ui/MeterBar";
import { formatAmount } from "@/shared/utils/format";

import { StatBox } from "./StatBox";

type MonthSummaryCardProps = {
	monthLabel: string;
	spent: number;
	budget: number;
	noSpendDays: number;
	score: number;
};

export function MonthSummaryCard({ monthLabel, spent, budget, noSpendDays, score }: MonthSummaryCardProps) {
	return (
		<Card className="flex flex-col gap-2.5 px-4 py-3.5">
			<div className="flex items-center justify-between text-xs text-mute">
				<span>{monthLabel}</span>
				<span>예산 {formatAmount(budget)}원</span>
			</div>
			<p className="text-headline text-ink">
				<AnimatedAmount value={spent} />원
			</p>
			<MeterBar value={spent} max={budget} />
			<div className="flex gap-2">
				<StatBox label="무지출" value={`${noSpendDays}일`} />
				<StatBox label="거지력" value={`${score}점`} hint="거지력 산식" />
			</div>
		</Card>
	);
}
