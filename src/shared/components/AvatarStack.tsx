import { Avatar } from "./Avatar";

type AvatarStackProps = {
	labels: string[];
	max?: number;
};

export function AvatarStack({ labels, max = 3 }: AvatarStackProps) {
	const visible = labels.slice(0, max);
	const overflow = labels.length - visible.length;

	return (
		<div className="flex items-center -space-x-2">
			{visible.map((label, index) => (
				<span key={`${label}-${index}`} className="rounded-full ring-2 ring-card">
					<Avatar label={label} size="sm" />
				</span>
			))}
			{overflow > 0 && (
				<span className="flex size-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-surface ring-2 ring-card">
					+{overflow}
				</span>
			)}
		</div>
	);
}
