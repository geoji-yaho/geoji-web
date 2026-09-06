import type { PropsWithChildren } from "react";

import { cn } from "../lib/cn";

type ToastProps = PropsWithChildren<{
	className?: string;
}>;

export function Toast({ children, className }: ToastProps) {
	return (
		<div
			role="status"
			className={cn(
				"inline-flex items-center gap-2 rounded-full bg-fill px-4.5 py-3 text-control text-ink shadow-card",
				className
			)}
		>
			<span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-red" />
			{children}
		</div>
	);
}
