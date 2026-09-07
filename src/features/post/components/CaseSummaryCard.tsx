import { TierBadge } from "@/shared/components/TierBadge";
import type { Tier } from "@/shared/domain/tier";
import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";
import { formatAmount } from "@/shared/utils/format";

type CaseSummaryCardProps = {
	name: string;
	tier: Tier;
	timeAgo: string;
	category: string;
	amount: number;
	title: string;
	plea: string;
	ruleNote: string;
};

export function CaseSummaryCard({
	name,
	tier,
	timeAgo,
	category,
	amount,
	title,
	plea,
	ruleNote
}: CaseSummaryCardProps) {
	return (
		<Card>
			<div className="flex flex-col gap-2.5 p-4">
				<div className="flex items-center gap-2.5">
					<Avatar name={name} />
					<div className="flex-1">
						<div className="flex items-center gap-1.5">
							<span className="text-sm font-black text-ink">{name}</span>
							<TierBadge tier={tier} />
						</div>
						<p className="text-caption text-dim">
							{timeAgo}, {category}
						</p>
					</div>
				</div>

				<div className="flex items-baseline gap-2">
					<strong className="text-amount-sm text-ink">{formatAmount(amount)}원</strong>
					<span className="text-control text-mute">{title}</span>
				</div>

				<p className="text-body text-text">&quot;{plea}&quot;</p>

				<div className="flex h-18 items-center justify-center rounded-2xl bg-fill text-caption text-dim">증거 사진</div>

				<p className="text-chip text-mute">참고 규칙: {ruleNote}</p>
			</div>
		</Card>
	);
}
