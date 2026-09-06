import { cn } from "../lib/cn";

type CountBadgeProps = {
	count: number;
	className?: string;
};

export function CountBadge({ count, className }: CountBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex h-5.5 min-w-5.5 shrink-0 items-center justify-center rounded-lg bg-ink px-1.5 text-tag font-black text-card",
				className
			)}
		>
			{count}
		</span>
	);
}
