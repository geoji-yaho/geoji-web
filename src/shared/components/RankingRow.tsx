import { DEBT_SCORE_PENDING_LABEL } from "../domain/score";
import type { Tier } from "../domain/tier";
import { cn } from "../lib/cn";
import { Avatar } from "../ui/Avatar";
import { TierBadge } from "./TierBadge";

export type RankingRowProps = {
	rank: number | null;
	name: string;
	tier: Tier | null;
	value: string | null;
	isMe?: boolean;
	className?: string;
};

export function RankingRow({ rank, name, tier, value, isMe = false, className }: RankingRowProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-2.5 rounded-2xl bg-card px-3.5 py-2.5 text-control shadow-card",
				isMe && "bg-fill",
				className
			)}
		>
			<span className={cn("w-3.5 font-black", rank !== null && rank <= 3 ? "text-red" : "text-dim")}>{rank}</span>
			<Avatar name={name} size="sm" />
			<span className="flex-1 truncate font-extrabold text-ink">{name}</span>
			{tier === null ? (
				<span className="text-tag text-dim">{DEBT_SCORE_PENDING_LABEL}</span>
			) : (
				<TierBadge tier={tier} />
			)}
			{value !== null && <span className="font-black text-ink">{value}</span>}
		</div>
	);
}
