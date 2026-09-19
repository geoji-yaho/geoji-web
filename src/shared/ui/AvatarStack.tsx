import { cn } from "../lib/cn";
import { Avatar } from "./Avatar";

export type AvatarStackItem = {
	name: string;
	imageUrl?: string | null;
};

type AvatarStackProps = {
	items: AvatarStackItem[];
	max?: number;
	className?: string;
};

export function AvatarStack({ items, max = 3, className }: AvatarStackProps) {
	const visible = items.slice(0, max);
	const overflow = items.length - visible.length;

	return (
		<ul className={cn("flex items-center -space-x-1.5", className)}>
			{visible.map((item, index) => (
				<li key={`${item.name}-${index}`} className="flex">
					<Avatar name={item.name} src={item.imageUrl} size="xs" className="ring-2 ring-screen" />
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
