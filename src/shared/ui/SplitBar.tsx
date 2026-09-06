import { cn } from "../lib/cn";
import { toPercent } from "../utils/percent";

type SplitBarProps = {
	opposeValue: number;
	supportValue: number;
	className?: string;
};

export function SplitBar({ opposeValue, supportValue, className }: SplitBarProps) {
	const total = opposeValue + supportValue;
	const leftPercent = toPercent(opposeValue, total);
	const rightPercent = total > 0 ? 100 - leftPercent : 0;

	return (
		<div className={cn("flex h-2 w-full overflow-hidden rounded-full bg-page", className)}>
			<span className="h-full bg-red" style={{ width: `${leftPercent}%` }} />
			<span className="h-full bg-green" style={{ width: `${rightPercent}%` }} />
		</div>
	);
}
