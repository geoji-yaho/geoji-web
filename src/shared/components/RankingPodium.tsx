import type { Tier } from "../domain/tier";
import { cn } from "../lib/cn";
import { Avatar } from "../ui/Avatar";
import { TierBadge } from "./TierBadge";

export type PodiumPlace = 1 | 2 | 3;

export type PodiumEntry = {
	place: PodiumPlace;
	name: string;
	imageUrl?: string | null;
	tier: Tier;
	value: string;
	isMe?: boolean;
};

const PODIUM_ORDER: Record<PodiumPlace, string> = {
	1: "order-2",
	2: "order-1",
	3: "order-3"
};

type RankingPodiumProps = {
	entries: PodiumEntry[];
	className?: string;
};

export function RankingPodium({ entries, className }: RankingPodiumProps) {
	const ordered = [...entries].sort((a, b) => a.place - b.place);

	return (
		<ol className={cn("flex items-end gap-2", className)}>
			{ordered.map((entry) => (
				<li
					key={entry.place}
					className={cn(
						"flex flex-1 flex-col items-center gap-1.5 rounded-card bg-card px-2.5 py-3.5 text-ink shadow-card",
						PODIUM_ORDER[entry.place],
						entry.isMe && "bg-ink text-card",
						entry.place === 1 && "py-4.5"
					)}
				>
					<Avatar name={entry.name} src={entry.imageUrl} size={entry.place === 1 ? "lg" : "md"} />
					<span className="text-control font-black">{entry.name}</span>
					<TierBadge tier={entry.tier} className={cn(entry.isMe && "ring-1 ring-card")} />
					<span className={cn("text-base font-black", entry.isMe ? "text-cta" : "text-ink")}>{entry.value}</span>
					<span className={cn("text-tag", entry.isMe ? "text-cta" : "text-dim")}>{entry.place}위</span>
				</li>
			))}
		</ol>
	);
}
