import type { VoteTally } from "../domain/verdict";
import { cn } from "../lib/cn";
import { SplitBar } from "../ui/SplitBar";

type TallyRowProps = {
	tally: VoteTally;
	opposeLabel: string;
	supportLabel: string;
	className?: string;
};

export function TallyRow({ tally, opposeLabel, supportLabel, className }: TallyRowProps) {
	return (
		<div className={cn("flex items-center gap-2.5", className)}>
			<SplitBar opposeValue={tally.oppose} supportValue={tally.support} className="flex-1" />
			<span className="shrink-0 text-xs font-black text-red">
				{opposeLabel} {tally.oppose}
			</span>
			<span className="shrink-0 text-xs font-black text-green">
				{supportLabel} {tally.support}
			</span>
		</div>
	);
}
