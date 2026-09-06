import type { PropsWithChildren } from "react";

import { cn } from "../lib/cn";

type IconButtonProps = PropsWithChildren<{
	label: string;
	onClick?: () => void;
	className?: string;
}>;

export function IconButton({ label, children, onClick, className }: IconButtonProps) {
	return (
		<button
			type="button"
			aria-label={label}
			onClick={onClick}
			className={cn(
				"inline-flex size-9 shrink-0 pressable items-center justify-center rounded-full bg-fill text-ink",
				className
			)}
		>
			{children}
		</button>
	);
}
