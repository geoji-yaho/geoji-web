import { Tag } from "../ui/Tag";

type StatusTagProps = {
	label: string;
	className?: string;
};

export function StatusTag({ label, className }: StatusTagProps) {
	return (
		<Tag tone="redOutline" className={className}>
			{label}
		</Tag>
	);
}
