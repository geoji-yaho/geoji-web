import type { ReactNode } from "react";

import { cn } from "../lib/cn";

type BottomSheetProps = {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	className?: string;
};

export function BottomSheet({ open, onClose, children, className }: BottomSheetProps) {
	if (!open) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center">
			<button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-ink/45" />
			<div
				role="dialog"
				aria-modal="true"
				className={cn(
					"relative flex w-full max-w-md flex-col gap-3 rounded-t-3xl bg-screen px-5 pt-3.5 pb-6",
					className
				)}
			>
				<span aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line" />
				{children}
			</div>
		</div>
	);
}
