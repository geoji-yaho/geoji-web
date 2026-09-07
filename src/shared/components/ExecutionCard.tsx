import { type Execution, EXECUTION_LABELS } from "../domain/verdict";
import { cn } from "../lib/cn";
import { Card } from "../ui/Card";
import { ExecutionMeter } from "./ExecutionMeter";

type ExecutionCardProps = {
	execution: Execution;
	className?: string;
};

export function ExecutionCard({ execution, className }: ExecutionCardProps) {
	const { status, daysLeft, totalDays } = execution;
	const active = status === "active";

	return (
		<Card className={cn("flex flex-col gap-2 px-4 py-3.25", className)}>
			<div className="flex items-center justify-between text-control">
				<span className="font-black text-red">
					{EXECUTION_LABELS[status]}
					{active && ` (D-${daysLeft})`}
				</span>
				{active && <span className="text-dim">남은 무지출 {daysLeft}일</span>}
			</div>
			<ExecutionMeter daysLeft={daysLeft} totalDays={totalDays} />
		</Card>
	);
}
