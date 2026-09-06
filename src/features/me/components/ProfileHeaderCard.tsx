import { TierBadge } from "@/shared/components/TierBadge";
import { TierTrack } from "@/shared/components/TierTrack";
import type { Tier } from "@/shared/domain/tier";
import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";

type ProfileHeaderCardProps = {
	name: string;
	tier: Tier;
	nextTierLabel: string;
	nextTierScore: number;
};

export function ProfileHeaderCard({ name, tier, nextTierLabel, nextTierScore }: ProfileHeaderCardProps) {
	return (
		<Card className="flex flex-col gap-3.5 rounded-3xl p-4.5">
			<div className="flex items-center gap-3.5">
				<Avatar name={name} size="xl" />
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="truncate text-xl font-black text-ink">{name}</span>
						<button type="button" className="shrink-0 text-tag font-black text-red">
							변경
						</button>
					</div>
					<div className="mt-1">
						<TierBadge tier={tier} />
					</div>
				</div>
				<div className="shrink-0 text-right">
					<span className="block text-caption text-mute">{nextTierLabel}</span>
					<span className="text-title text-red">{nextTierScore}점</span>
				</div>
			</div>
			<TierTrack tier={tier} />
		</Card>
	);
}
