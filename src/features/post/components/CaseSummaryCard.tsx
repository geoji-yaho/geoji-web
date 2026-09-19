import { TierBadge } from "@/shared/components/TierBadge";
import type { Tier } from "@/shared/domain/tier";
import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";
import { formatAmount } from "@/shared/utils/format";

type CaseSummaryCardProps = {
	name: string;
	tier?: Tier;
	timeAgo: string;
	category?: string;
	amount: number;
	title?: string;
	reason?: string | null;
	rules: string[];
};

export function CaseSummaryCard({ name, tier, timeAgo, category, amount, title, reason, rules }: CaseSummaryCardProps) {
	const meta = [timeAgo, category].filter((part) => part !== undefined && part !== "").join(", ");

	return (
		<Card>
			<div className="flex flex-col gap-2.5 p-4">
				<div className="flex items-center gap-2.5">
					<Avatar name={name} />
					<div className="flex-1">
						<div className="flex items-center gap-1.5">
							<span className="text-sm font-black text-ink">{name}</span>
							{tier && <TierBadge tier={tier} />}
						</div>
						<p className="text-caption text-dim">{meta}</p>
					</div>
				</div>

				<div className="flex items-baseline gap-2">
					<strong className="shrink-0 text-amount-sm text-ink">{formatAmount(amount)}원</strong>
					{title && <span className="text-control text-mute">{title}</span>}
				</div>

				{reason && <p className="text-control text-mute">&ldquo;{reason}&rdquo;</p>}

				{rules.length > 0 && (
					<div className="flex flex-col gap-1 text-chip text-mute">
						<span>참고 규칙</span>
						<ul className="flex flex-col gap-0.5">
							{rules.map((rule, index) => (
								<li key={`${index}-${rule}`}>{rule}</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</Card>
	);
}
