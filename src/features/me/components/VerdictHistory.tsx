import { type Verdict, VERDICT_LABELS, VERDICT_SIDES, type VerdictSide } from "@/shared/domain/verdict";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/Card";

const VERDICT_SIDE_STYLES: Record<VerdictSide, string> = {
	oppose: "text-red",
	support: "text-green",
	none: "text-mute"
};

type VerdictHistoryProps = {
	guilty: number;
	notGuilty: number;
	dismissed: number;
	className?: string;
};

export function VerdictHistory({ guilty, notGuilty, dismissed, className }: VerdictHistoryProps) {
	const counts: { verdict: Verdict; count: number }[] = [
		{ verdict: "guilty", count: guilty },
		{ verdict: "notGuilty", count: notGuilty },
		{ verdict: "dismissed", count: dismissed }
	];

	return (
		<div className={cn("flex gap-2", className)}>
			{counts.map(({ verdict, count }) => (
				<Card key={verdict} className="flex-1 p-2.75 text-center">
					<p className={cn("text-tag font-black", VERDICT_SIDE_STYLES[VERDICT_SIDES[verdict]])}>
						{VERDICT_LABELS[verdict]}
					</p>
					<p className="text-title text-ink">{count}</p>
				</Card>
			))}
		</div>
	);
}
