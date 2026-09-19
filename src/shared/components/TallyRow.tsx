import type { VoteTally } from "../domain/verdict";
import { cn } from "../lib/cn";
import { SplitBar } from "../ui/SplitBar";

type TallyRowProps = {
	tally: VoteTally;
	opposeLabel: string;
	supportLabel: string;
	supportFirst?: boolean;
	className?: string;
};

export function TallyRow({ tally, opposeLabel, supportLabel, supportFirst = false, className }: TallyRowProps) {
	const oppose = (
		<span className="shrink-0 text-xs font-black text-red">
			{opposeLabel} {tally.oppose}
		</span>
	);
	const support = (
		<span className="shrink-0 text-xs font-black text-green">
			{supportLabel} {tally.support}
		</span>
	);

	return (
		<div className={cn("flex items-center gap-2.5", className)}>
			<SplitBar
				opposeValue={tally.oppose}
				supportValue={tally.support}
				supportFirst={supportFirst}
				className="flex-1"
			/>
			{supportFirst ? support : oppose}
			{supportFirst ? oppose : support}
		</div>
	);
}
