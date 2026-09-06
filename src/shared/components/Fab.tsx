import { cn } from "../lib/cn";
import { Button } from "./Button";

type FabProps = {
	label: string;
	onClick?: () => void;
	/** 화면 자리는 페이지가 준다. 오른쪽 아래 고정이면 "fixed right-5 bottom-6 z-40" */
	className?: string;
};

export function Fab({ label, onClick, className }: FabProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"inline-flex h-13 shrink-0 items-center rounded-full bg-cta px-5 text-base font-extrabold text-ink shadow-fab",
				className
			)}
		>
			{label}
		</button>
	);
}

type StickyCtaProps = {
	label: string;
	onClick?: () => void;
	disabled?: boolean;
	/** 화면 자리는 페이지가 준다. 하단 고정이면 "fixed inset-x-5 bottom-5 z-40 w-auto" */
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
