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
		<ul className={cn("flex items-center -space-x-1.5", className)}>
			{visible.map((name, index) => (
				<li key={`${name}-${index}`} className="flex">
					<Avatar name={name} size="xs" className="ring-2 ring-screen" />
				</li>
			))}
			{overflow > 0 && (
				<li className="inline-flex size-5.5 shrink-0 items-center justify-center rounded-full bg-ink text-tag font-extrabold text-card ring-2 ring-screen">
					+{overflow}
				</li>
			)}
		</ul>
	);
}
