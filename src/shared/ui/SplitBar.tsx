import { cn } from "../lib/cn";
import { toPercent } from "../utils/percent";

type SplitBarProps = {
	opposeValue: number;
	supportValue: number;
	supportFirst?: boolean;
	className?: string;
};

export function SplitBar({ opposeValue, supportValue, supportFirst = false, className }: SplitBarProps) {
	const total = opposeValue + supportValue;
	const opposePercent = toPercent(opposeValue, total);
	const supportPercent = total > 0 ? 100 - opposePercent : 0;

	const oppose = <span className="h-full bg-red" style={{ width: `${opposePercent}%` }} />;
	const support = <span className="h-full bg-green" style={{ width: `${supportPercent}%` }} />;

	return (
		<div className={cn("flex h-2 w-full overflow-hidden rounded-full bg-page", className)}>
			{supportFirst ? support : oppose}
			{supportFirst ? oppose : support}
		</div>
	);
}
