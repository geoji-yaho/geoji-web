import { type PodiumEntry, RankingPodium } from "@/shared/components/RankingPodium";
import { RankingRow, type RankingRowProps } from "@/shared/components/RankingRow";
import { Reveal } from "@/shared/ui/Reveal";

export type RankingEntry = Pick<RankingRowProps, "rank" | "name" | "tier" | "value">;

type RankingSectionProps = {
	title: string;
	caption: string;
	podium?: PodiumEntry[];
	rows: RankingEntry[];
	revealFrom?: number;
};

export function RankingSection({ title, caption, podium, rows, revealFrom = 0 }: RankingSectionProps) {
	return (
		<section className="flex flex-col gap-2.5">
			<div className="flex items-baseline gap-2">
				<h2 className="text-base font-black text-ink">{title}</h2>
				<span className="text-caption whitespace-nowrap text-dim">{caption}</span>
			</div>
			{podium && (
				<Reveal index={revealFrom}>
					<RankingPodium entries={podium} />
				</Reveal>
			)}
			<ol className="flex flex-col gap-2.5">
				{rows.map((row, index) => (
					<Reveal key={row.rank} as="li" index={revealFrom + (podium ? 1 : 0) + index}>
						<RankingRow rank={row.rank} name={row.name} tier={row.tier} value={row.value} />
					</Reveal>
				))}
			</ol>
		</section>
	);
}
