import type { ReactNode } from "react";

type BottomSheetProps = {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
};

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
	if (!open) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center">
			<button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-black/45" />
			<div className="relative w-full max-w-md rounded-t-3xl bg-surface p-5 pt-3">
				<span className="mx-auto block h-1 w-10 rounded-full bg-line" />
				<div className="mt-4">{children}</div>
			</div>
		</div>
	);
}
