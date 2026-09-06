import { cn } from "../lib/cn";
import type { Tier } from "../types/tier";
import { Avatar } from "./Avatar";
import { TierBadge } from "./TierBadge";

type PodiumEntry = {
	place: 1 | 2 | 3;
	name: string;
	value: string;
	isMe?: boolean;
};

const PODIUM_ORDER: Record<PodiumEntry["place"], number> = {
	2: 0,
	1: 1,
	3: 2
};

type RankingPodiumProps = {
	entries: PodiumEntry[];
	className?: string;
};

export function RankingPodium({ entries, className }: RankingPodiumProps) {
	const ordered = [...entries].sort((a, b) => PODIUM_ORDER[a.place] - PODIUM_ORDER[b.place]);

	return (
		<div className={cn("flex items-end gap-2", className)}>
			{ordered.map((entry) => (
				<div
					key={entry.place}
					className={cn(
						"flex flex-1 flex-col items-center gap-1.5 rounded-card bg-card px-2.5 py-3.5 text-ink shadow-card",
						entry.isMe && "bg-ink text-card",
						entry.place === 1 && "py-4.5"
					)}
				>
					<Avatar name={entry.name} size={entry.place === 1 ? "lg" : "md"} />
					<span className="text-control font-black">{entry.name}</span>
					<span className={cn("text-base font-black", entry.isMe ? "text-cta" : "text-ink")}>{entry.value}</span>
					<span className={cn("text-tag", entry.isMe ? "text-cta" : "text-dim")}>{entry.place}위</span>
				</div>
			))}
		</div>
	);
}

type RankingRowProps = {
	rank: number;
	name: string;
	tier: Tier;
	value: string;
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
			<span className={cn("w-3.5 font-black", rank <= 3 ? "text-red" : "text-dim")}>{rank}</span>
			<Avatar name={name} size="sm" />
			<span className="flex-1 truncate font-extrabold text-ink">{name}</span>
			<TierBadge tier={tier} />
			<span className="font-black text-ink">{value}</span>
		</div>
	);
}

type MyRankRowProps = {
	name: string;
	noSpendRank: number;
	nagRank: number;
	className?: string;
};

export function MyRankRow({ name, noSpendRank, nagRank, className }: MyRankRowProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 rounded-card bg-ink px-5 py-3.5 text-control text-card shadow-card",
				className
			)}
		>
			<Avatar name={name} size="sm" />
			<span className="flex-1 font-black">내 순위</span>
			<span>
				<b className="font-black text-cta">무지출 {noSpendRank}위</b> · 잔소리 {nagRank}위
			</span>
		</div>
	);
}
