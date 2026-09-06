import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { DURATION, EASE_OUT } from "@/shared/lib/motion";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";

const ROOM_PATH = "/rooms/1";
const INITIAL_REVISED_TITLE = "아이스크림 구매";
const HEADLINE_LINES = ["저기요.", "그럴싸한 이름 붙이지 마시고", "솔직히 얘기하세요."];
const CARD_SCALE_FROM = 0.96;

type HonestyModalProps = {
	open: boolean;
	originalTitle: string;
};

export function HonestyModal({ open, originalTitle }: HonestyModalProps) {
	const navigate = useNavigate();
	const [revisedTitle, setRevisedTitle] = useState(INITIAL_REVISED_TITLE);

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

						<p className="rounded-2xl bg-fill px-3.5 py-3 text-chip leading-normal text-mute line-through">
							{originalTitle}
						</p>

						<input
							aria-label="솔직하게 고친 내용"
							value={revisedTitle}
							onChange={(event) => setRevisedTitle(event.target.value)}
							className="rounded-2xl border-2 border-red bg-card px-3.5 py-3 text-subtitle font-extrabold text-ink outline-none"
						/>

						<Button onClick={() => navigate(ROOM_PATH)}>솔직하게 고쳤어요</Button>

						<button type="button" onClick={() => navigate(ROOM_PATH)} className="text-center text-control text-mute">
							이대로 회부 (가중처벌 가능)
						</button>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
