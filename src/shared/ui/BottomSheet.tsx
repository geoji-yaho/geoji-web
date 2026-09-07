import { AnimatePresence, motion } from "motion/react";
import { type PropsWithChildren, useId } from "react";

import { cn } from "../lib/cn";
import { DURATION, EASE_OUT, SPRING_SHEET } from "../lib/motion";

type BottomSheetProps = PropsWithChildren<{
	open: boolean;
	onClose: () => void;
	title: string;
	className?: string;
}>;

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
	const titleId = useId();

	return (
		<AnimatePresence>
			{open && (
				<div key="bottom-sheet" className="fixed inset-0 z-50 flex items-end justify-center">
					<motion.button
						type="button"
						aria-label="닫기"
						onClick={onClose}
						className="absolute inset-0 bg-scrim"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: DURATION.fast, ease: EASE_OUT }}
					/>
					<motion.div
						role="dialog"
						aria-modal="true"
						aria-labelledby={titleId}
						className={cn(
							"relative flex w-full max-w-phone flex-col gap-3 rounded-t-3xl bg-screen px-5 pt-3.5 pb-6",
							className
						)}
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={SPRING_SHEET}
					>
						<span aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line" />
						<h2 id={titleId} className="text-title text-ink">
							{title}
						</h2>
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
