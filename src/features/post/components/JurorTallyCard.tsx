import type { PostType } from "@/shared/domain/post";
import { VERDICT_LABELS, VOTE_VERDICTS, type VoteTally } from "@/shared/domain/verdict";
import { Card } from "@/shared/ui/Card";
import { SplitBar } from "@/shared/ui/SplitBar";

type JurorTallyCardProps = {
	postType: PostType;
	tally: VoteTally;
	ruleNote: string;
};

export function JurorTallyCard({ postType, tally, ruleNote }: JurorTallyCardProps) {
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
			<p className="text-xs text-mute">참고 규칙: {ruleNote}</p>
		</Card>
	);
}
