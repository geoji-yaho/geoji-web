import { AnimatePresence, motion } from "motion/react";
import { type SubmitEvent, useState } from "react";

import { DURATION, EASE_OUT } from "@/shared/lib/motion";
import { Alert } from "@/shared/ui/Alert";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";

const HEADLINE_LINES = ["저기요.", "그럴싸한 이름 붙이지 마시고", "솔직히 얘기하세요."];
const CARD_SCALE_FROM = 0.96;
const TITLE_MAX_LENGTH = 30;

type HonestyModalProps = {
	open: boolean;
	originalTitle: string;
	message: string | null;
	suggestedTitle: string | null;
	canProceed: boolean;
	isPending: boolean;
	errorMessage: string | null;
	onRevise: (title: string) => void;
	onProceed: () => void;
};

export function HonestyModal({
	open,
	originalTitle,
	message,
	suggestedTitle,
	canProceed,
	isPending,
	errorMessage,
	onRevise,
	onProceed
}: HonestyModalProps) {
	const initialTitle = suggestedTitle ?? originalTitle;
	const [revisedTitle, setRevisedTitle] = useState(initialTitle);
	const [prevOpen, setPrevOpen] = useState(open);

	if (open !== prevOpen) {
		setPrevOpen(open);
		if (open) {
			setRevisedTitle(initialTitle);
		}
	}

	const trimmedTitle = revisedTitle.trim();
	const isTitleValid = trimmedTitle.length > 0 && trimmedTitle.length <= TITLE_MAX_LENGTH;
	const canRevise = isTitleValid && !isPending;

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (canRevise) {
			onRevise(trimmedTitle);
		}
	};

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					key="honesty-modal"
					className="absolute inset-0 z-50 flex items-center justify-center bg-scrim p-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: DURATION.fast, ease: EASE_OUT }}
				>
					<motion.div
						role="dialog"
						aria-modal="true"
						aria-labelledby="honesty-modal-headline"
						className="flex w-full flex-col gap-3.5 rounded-3xl bg-card px-5 py-5.5 shadow-fab"
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

						{message && <p className="text-chip text-mute">{message}</p>}

						<p className="rounded-2xl bg-fill px-3.5 py-3 text-chip leading-normal text-mute line-through">
							{originalTitle}
						</p>

						<form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
							<input
								aria-label="솔직하게 고친 내용"
								autoFocus
								value={revisedTitle}
								maxLength={TITLE_MAX_LENGTH}
								onChange={(event) => setRevisedTitle(event.target.value)}
								className="rounded-2xl border-2 border-red bg-card px-3.5 py-3 text-subtitle font-extrabold text-ink outline-none"
							/>

							{errorMessage && <Alert>{errorMessage}</Alert>}

							<Button type="submit" disabled={!canRevise}>
								솔직하게 고쳤어요
							</Button>

							{canProceed && (
								<button
									type="button"
									onClick={onProceed}
									disabled={isPending}
									className="text-center text-control text-mute disabled:text-dim"
								>
									이대로 회부 (가중처벌 가능)
								</button>
							)}
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
