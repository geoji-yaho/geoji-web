import { cn } from "../lib/cn";
import { Card } from "../ui/Card";
import { LogoIcon } from "./LogoIcon";

type EmptyStateProps = {
	title: string;
	description?: string;
	className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
	return (
		<Card className={cn("flex flex-col items-center gap-2.5 px-5 py-7 text-center", className)}>
			<LogoIcon className="size-14" />
			<p className="text-subtitle text-ink">{title}</p>
			{description && <p className="text-chip whitespace-pre-line text-mute">{description}</p>}
		</Card>
	);
}
