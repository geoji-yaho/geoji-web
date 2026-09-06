import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";
import { type Verdict, VERDICT_LABELS, VERDICT_SIDES } from "../types/verdict";

const verdictStampVariants = cva(
	"inline-flex shrink-0 -rotate-7 items-center justify-center rounded-stamp text-stamp-text shadow-stamp select-none",
	{
		variants: {
			side: {
				oppose: "bg-red",
				support: "bg-green",
				none: "bg-gray"
			},
			size: {
				sm: "size-13.5 text-stamp-sm",
				md: "size-16 text-stamp-md",
				lg: "size-24 text-stamp-lg"
			}
		},
		defaultVariants: {
			size: "sm"
		}
	}
);

type VerdictStampProps = Omit<VariantProps<typeof verdictStampVariants>, "side"> & {
	verdict: Verdict;
	className?: string;
};

export function VerdictStamp({ verdict, size, className }: VerdictStampProps) {
	return (
		<span
			role="img"
			aria-label={`${VERDICT_LABELS[verdict]} 도장`}
			className={cn(verdictStampVariants({ side: VERDICT_SIDES[verdict], size }), className)}
		>
			{VERDICT_LABELS[verdict]}
		</span>
	);
}
