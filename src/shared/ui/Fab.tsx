import { cn } from "../lib/cn";

type FabProps = {
	label: string;
	onClick?: () => void;
	className?: string;
};

export function Fab({ label, onClick, className }: FabProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"inline-flex h-13 shrink-0 pressable items-center rounded-full bg-cta px-5 text-base font-extrabold text-ink shadow-fab",
				className
			)}
		>
			{label}
		</button>
	);
}
