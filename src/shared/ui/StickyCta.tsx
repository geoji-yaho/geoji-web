import { cn } from "../lib/cn";
import { Button } from "./Button";

type StickyCtaProps = {
	label: string;
	onClick?: () => void;
	disabled?: boolean;
	secondaryLabel?: string;
	onSecondaryClick?: () => void;
	className?: string;
};

export function StickyCta({
	label,
	onClick,
	disabled = false,
	secondaryLabel,
	onSecondaryClick,
	className
}: StickyCtaProps) {
	return (
		<div className={cn("flex w-full gap-2", className)}>
			{secondaryLabel && (
				<Button variant="secondary" onClick={onSecondaryClick} className="h-11 w-auto shrink-0 px-5 py-0 shadow-cta">
					{secondaryLabel}
				</Button>
			)}
			<Button onClick={onClick} disabled={disabled} className="h-11 py-0 shadow-cta">
				{label}
			</Button>
		</div>
	);
}
