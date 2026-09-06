import { Avatar } from "./Avatar";
import { TagBadge } from "./Badge";

type PodiumEntry = {
	place: 1 | 2 | 3;
	name: string;
	value: string;
	isMe?: boolean;
};

export function RankingPodium({ entries }: { entries: PodiumEntry[] }) {
	const ordered = [...entries].sort((a, b) => {
		const order = { 2: 0, 1: 1, 3: 2 };
		return order[a.place] - order[b.place];
	});

	return (
		<div className="flex items-end gap-2">
			{ordered.map((entry) => (
				<div
					key={entry.place}
					className={`flex flex-1 flex-col items-center gap-2 rounded-2xl p-4 ${
						entry.isMe ? "bg-ink" : "bg-card"
					} ${entry.place === 1 ? "py-6" : ""}`}
				>
					<Avatar label={entry.name.slice(0, 1)} size={entry.place === 1 ? "lg" : "md"} highlighted={entry.isMe} />
					<span className={`text-sm font-bold ${entry.isMe ? "text-surface" : "text-ink"}`}>{entry.name}</span>
					<span className={`text-lg font-black ${entry.isMe ? "text-gold" : "text-ink"}`}>{entry.value}</span>
					<span className={`text-xs ${entry.isMe ? "text-muted" : "text-muted"}`}>{entry.place}위</span>
				</div>
			))}
		</div>
	);
}

type RankingRowProps = {
	rank: number;
	name: string;
	tier: string;
	value: string;
	highlightRank?: boolean;
};

export function RankingRow({ rank, name, tier, value, highlightRank = false }: RankingRowProps) {
	return (
		<div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3">
			<span className={`w-4 text-sm font-bold ${highlightRank ? "text-terracotta" : "text-muted"}`}>{rank}</span>
			<Avatar label={name.slice(0, 1)} size="sm" />
			<span className="flex-1 text-sm font-bold text-ink">{name}</span>
			<TagBadge label={tier} />
			<span className="text-sm font-bold text-ink">{value}</span>
		</div>
	);
}

export function MyRankRow({ name, valueLabel }: { name: string; valueLabel: string }) {
	return (
		<div className="flex items-center gap-3 rounded-2xl bg-ink px-4 py-3">
			<Avatar label={name.slice(0, 1)} size="sm" highlighted />
			<span className="flex-1 text-sm font-bold text-surface">내 순위</span>
			<span className="text-sm font-bold text-gold">{valueLabel}</span>
		</div>
	);
}
