import { AnimatePresence, motion } from "motion/react";
import { type KeyboardEvent, type SubmitEvent, useEffect, useRef, useState } from "react";

import { DURATION, EASE_OUT } from "@/shared/lib/motion";
import { Alert } from "@/shared/ui/Alert";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";

const HEADLINE_LINES = ["저기요.", "그럴싸한 이름 붙이지 마시고", "솔직히 얘기하세요."];
const CARD_SCALE_FROM = 0.96;
const FOCUSABLE_SELECTOR = "input:not([disabled]), button:not([disabled])";
const TEXT_BUTTON_STYLES = "text-center text-control text-mute disabled:text-dim";

type HonestyModalProps = {
	open: boolean;
	originalTitle: string;
	question: string | null;
	suggestedTitle: string | null;
	maxLength: number;
	canProceed: boolean;
	isPending: boolean;
	errorMessage: string | null;
	onRevise: (title: string) => void;
	onProceed: () => void;
	onClose: () => void;
};

export function HonestyModal({
	open,
	originalTitle,
	question,
	suggestedTitle,
	maxLength,
	canProceed,
	isPending,
	errorMessage,
	onRevise,
	onProceed,
	onClose
}: HonestyModalProps) {
	const initialTitle = suggestedTitle ?? originalTitle;
	const [revisedTitle, setRevisedTitle] = useState(initialTitle);
	const [prevOpen, setPrevOpen] = useState(open);
	const dialogRef = useRef<HTMLDivElement>(null);
	const lastFocusedRef = useRef<HTMLElement | null>(null);

	if (open !== prevOpen) {
		setPrevOpen(open);
		if (open) {
			setRevisedTitle(initialTitle);
		}
	}

	useEffect(() => {
		if (!open) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
			lastFocusedRef.current?.focus();
		};
	}, [open]);

	const trimmedTitle = revisedTitle.trim();
	const isTitleValid = trimmedTitle.length > 0 && trimmedTitle.length <= maxLength;
	const canRevise = isTitleValid && !isPending;

	const handleClose = () => {
		if (isPending) {
			return;
		}

		onClose();
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (canRevise) {
			onRevise(trimmedTitle);
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Escape") {
			handleClose();
			return;
		}

		if (event.key !== "Tab") {
			return;
		}

		const focusables = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
		const first = focusables[0];
		const last = focusables[focusables.length - 1];

		if (first === undefined || last === undefined) {
			return;
		}

		const edge = event.shiftKey ? first : last;

		if (document.activeElement !== edge) {
			return;
		}

		event.preventDefault();
		(event.shiftKey ? last : first).focus();
	};

	return (
		<AnimatePresence>
			{open && (
				<div key="honesty-modal" className="fixed inset-0 z-50 flex items-center justify-center p-6">
					<motion.button
						type="button"
						aria-label="닫기"
						tabIndex={-1}
						onClick={handleClose}
						className="absolute inset-0 bg-scrim"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: DURATION.fast, ease: EASE_OUT }}
					/>
					<motion.div
						ref={dialogRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby="honesty-modal-headline"
						onKeyDown={handleKeyDown}
						className="relative flex w-full max-w-phone flex-col gap-3.5 rounded-3xl bg-card px-5 py-5.5 shadow-fab"
						initial={{ opacity: 0, scale: CARD_SCALE_FROM }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: CARD_SCALE_FROM }}
						transition={{ duration: DURATION.base, ease: EASE_OUT }}
					>
						<div className="flex items-center gap-2.5">
							<Avatar name="판" size="sm" className="size-8 bg-ink text-card" />
							<span className="text-chip font-black text-ink">AI 판사</span>
						</div>

						<h2 id="honesty-modal-headline" className="text-title text-ink">
							{HEADLINE_LINES.map((line) => (
								<span key={line} className="block">
									{line}
								</span>
							))}
						</h2>

						{question && <p className="text-chip text-mute">{question}</p>}

						<p className="rounded-2xl bg-fill px-3.5 py-3 text-chip leading-normal text-mute">
							<del className="line-through">{originalTitle}</del>
						</p>

						<form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
							<input
								aria-label="솔직하게 고친 내용"
								autoFocus
								value={revisedTitle}
								maxLength={maxLength}
								onChange={(event) => setRevisedTitle(event.target.value)}
								className="rounded-2xl border-2 border-red bg-card px-3.5 py-3 text-base font-extrabold text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink"
							/>

							{errorMessage && <Alert>{errorMessage}</Alert>}

							<Button type="submit" disabled={!canRevise}>
								솔직하게 고쳤어요
							</Button>

							{canProceed ? (
								<button type="button" onClick={onProceed} disabled={isPending} className={TEXT_BUTTON_STYLES}>
									이대로 회부 (가중처벌 가능)
								</button>
							) : (
								<button type="button" onClick={handleClose} disabled={isPending} className={TEXT_BUTTON_STYLES}>
									폼으로 돌아가기
								</button>
							)}
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
