import { useState } from "react";

import { MyRankRow } from "@/shared/components/MyRankRow";
import type { PodiumEntry } from "@/shared/components/RankingPodium";
import { Reveal } from "@/shared/ui/Reveal";
import { TabSegment } from "@/shared/ui/TabSegment";

import { type RankingEntry, RankingSection } from "../components/RankingSection";

const PERIODS = ["이번 주", "이번 달"] as const;

type Period = (typeof PERIODS)[number];

const NO_SPEND_PODIUM: PodiumEntry[] = [
	{ place: 2, name: "현우", value: "5일" },
	{ place: 1, name: "소윤", value: "6일", isMe: true },
	{ place: 3, name: "민재", value: "3일" }
];

const NO_SPEND_ROWS: RankingEntry[] = [
	{ rank: 4, name: "지민", tier: "hardcore", value: "1일" },
	{ rank: 5, name: "태양", tier: "penniless", value: "0일" }
];

const NAG_ROWS: RankingEntry[] = [{ rank: 1, name: "지민", tier: "hardcore", value: "48점" }];

const NAG_REVEAL_FROM = 2 + NO_SPEND_ROWS.length;

const MY_RANK = {
	name: "소윤",
	noSpendRank: 1,
	nagRank: 3
} as const;

export function RoomRankingPage() {
	const [period, setPeriod] = useState<Period>("이번 주");

	return (
		<>
			<div className="flex flex-1 flex-col gap-4 px-5 py-3">
				<Reveal>
					<TabSegment tabs={PERIODS} value={period} onChange={setPeriod} className="w-42.5 rounded-full" />
				</Reveal>

				<RankingSection
					title="무지출왕"
					caption="무지출 일수"
					podium={NO_SPEND_PODIUM}
					rows={NO_SPEND_ROWS}
					revealFrom={1}
				/>
				<RankingSection title="잔소리왕" caption="투표와 댓글 점수" rows={NAG_ROWS} revealFrom={NAG_REVEAL_FROM} />
			</div>

			<MyRankRow
				name={MY_RANK.name}
				noSpendRank={MY_RANK.noSpendRank}
				nagRank={MY_RANK.nagRank}
				className="sticky bottom-0 z-40 rounded-none"
			/>
		</>
	);
}
