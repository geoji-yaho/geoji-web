import type { Reaction } from "../types/post";
import type { Tier } from "../types/tier";
import { Avatar } from "./Avatar";
import { ReactionRow } from "./ReactionRow";
import { TierBadge } from "./TierBadge";

type NoSpendCardProps = {
	name: string;
	tier: Tier;
	/** 연속 무지출 일수 */
	streakDays: number;
	reactions: Reaction[];
	commentCount: number;
	onComments?: () => void;
};

export function NoSpendCard({ name, tier, streakDays, reactions, commentCount, onComments }: NoSpendCardProps) {
	return (
		<article className="flex flex-col gap-2.5 rounded-card bg-green/10 px-3.5 py-3">
			<div className="flex items-center gap-2.5">
				<Avatar name={name} size="sm" />
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<span className="text-control text-text">
						<b className="font-black text-ink">{name}</b>님이 오늘 0원 썼어요
					</span>
					<span className="flex items-center gap-1.5 text-caption text-mute">
						<TierBadge tier={tier} />
						<b className="font-black text-green">연속 {streakDays}일째</b>
					</span>
				</div>
			</div>
			<ReactionRow reactions={reactions} commentCount={commentCount} onComments={onComments} />
		</article>
	);
}
