import { cn } from "../lib/cn";
import { Avatar } from "./Avatar";

type AvatarStackProps = {
	names: string[];
	max?: number;
	className?: string;
};

export function AvatarStack({ names, max = 3, className }: AvatarStackProps) {
	const visible = names.slice(0, max);
	const overflow = names.length - visible.length;

	return (
		<div className={cn("flex items-center -space-x-1.5", className)}>
			{visible.map((name, index) => (
				<Avatar key={`${name}-${index}`} name={name} size="xs" className="ring-2 ring-screen" />
			))}
			{overflow > 0 && (
				<span className="inline-flex size-5.5 shrink-0 items-center justify-center rounded-full bg-ink text-tag font-extrabold text-card ring-2 ring-screen">
					+{overflow}
				</span>
			)}
		</div>
	);
}
