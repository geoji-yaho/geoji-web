import { cn } from "../lib/cn";
import { Button } from "./Button";

type StickyCtaProps = {
	label: string;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
};

export function StickyCta({ label, onClick, disabled = false, className }: StickyCtaProps) {
	return (
		<div className={cn("w-full", className)}>
			<Button onClick={onClick} disabled={disabled} className="h-11 py-0 shadow-cta">
				{label}
			</Button>
		</div>
	);
}
