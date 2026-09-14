import { cva } from "class-variance-authority";

import type { PostType } from "@/shared/domain/post";
import { type Verdict, VERDICT_LABELS, VERDICT_SIDES, VOTE_VERDICTS, type VoteTally } from "@/shared/domain/verdict";
import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";
import { SplitBar } from "@/shared/ui/SplitBar";

const voteLabelVariants = cva("shrink-0 text-xs font-black", {
	variants: {
		side: {
			oppose: "text-red",
			support: "text-green",
			none: "text-mute"
		}
	}
});

export type VoterItem = {
	id: string;
	name: string;
	verdict: Verdict;
	reason: string | null;
};

type JurorTallyCardProps = {
	postType: PostType;
	tally: VoteTally;
	voters: VoterItem[];
};

export function JurorTallyCard({ postType, tally, voters }: JurorTallyCardProps) {
	const { oppose, support } = VOTE_VERDICTS[postType];

	return (
		<Card className="flex flex-col gap-2.5 p-4">
			<h2 className="text-label text-mute">배심원 평결</h2>
			<SplitBar opposeValue={tally.oppose} supportValue={tally.support} className="h-2.5" />
			<div className="flex justify-between text-xs">
				<span className="font-black text-red">
					{VERDICT_LABELS[oppose]} {tally.oppose}
				</span>
				<span className="font-black text-green">
					{VERDICT_LABELS[support]} {tally.support}
				</span>
			</div>
			{voters.length > 0 && (
				<ul className="flex flex-col gap-2.5 border-t border-line pt-2.5">
					{voters.map((voter) => (
						<li key={voter.id} className="flex items-start gap-2.5">
							<Avatar name={voter.name} size="sm" />
							<div className="flex min-w-0 flex-1 flex-col gap-0.5">
								<div className="flex items-baseline justify-between gap-2">
									<span className="truncate text-chip font-extrabold text-ink">{voter.name}</span>
									<span className={voteLabelVariants({ side: VERDICT_SIDES[voter.verdict] })}>
										{VERDICT_LABELS[voter.verdict]}
									</span>
								</div>
								{voter.reason && <p className="text-chip text-text">{voter.reason}</p>}
							</div>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
