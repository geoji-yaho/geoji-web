import type { ReactNode } from "react";

import { cn } from "../lib/cn";

type AlertProps = {
	children: ReactNode;
	className?: string;
};

export function Alert({ children, className }: AlertProps) {
	return (
		<div
			role="alert"
			className={cn(
				"flex items-start gap-2 rounded-2xl border border-red bg-red/10 px-3.75 py-3.25 text-chip text-red",
				className
			)}
		>
			<span aria-hidden="true" className="font-black">
				!
			</span>
			<span>{children}</span>
		</div>
	);
}
