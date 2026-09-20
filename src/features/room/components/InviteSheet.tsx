import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { copyText, loadKakaoSdk, shareContent, shareToKakao } from "@/shared/lib/platform";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { Toast } from "@/shared/ui/Toast";

import { AiMemberButton } from "./AiMemberButton";

const TOAST_MS = 2500;
const SHARE_TITLE = "떼거지";
const SHARE_TEXT = "떼거지 거지방에 초대합니다";
const COPIED_MESSAGE = "링크를 복사했습니다";
const COPY_FAILED_MESSAGE = "링크를 복사하지 못했습니다";

type InviteSheetProps = {
	open: boolean;
	onClose: () => void;
	inviteUrl: string;
	roomId?: string;
	onLater?: () => void;
};

export function InviteSheet({ open, onClose, inviteUrl, roomId, onLater }: InviteSheetProps) {
	const [toast, setToast] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			void loadKakaoSdk();
		}
	}, [open]);

	useEffect(() => {
		if (toast === null) {
			return;
		}

		const timer = setTimeout(() => setToast(null), TOAST_MS);
		return () => clearTimeout(timer);
	}, [toast]);

	const handleCopy = async () => {
		setToast((await copyText(inviteUrl)) ? COPIED_MESSAGE : COPY_FAILED_MESSAGE);
	};

	const handleShare = async () => {
		const input = { title: SHARE_TITLE, text: SHARE_TEXT, url: inviteUrl };
		if (await shareToKakao(input)) {
			return;
		}

		const outcome = await shareContent(input);
		if (outcome === "copied") {
			setToast(COPIED_MESSAGE);
		} else if (outcome === "failed") {
			setToast(COPY_FAILED_MESSAGE);
		}
	};

	return (
		<BottomSheet open={open} onClose={onClose} title="친구 초대">
			<div className="flex gap-2">
				<span className="min-w-0 flex-1 truncate rounded-2xl bg-fill px-3.5 py-3 text-control text-mute">
					{inviteUrl}
				</span>
				<button
					type="button"
					onClick={() => void handleCopy()}
					className="shrink-0 rounded-xl border border-dim bg-card px-4 text-control font-black text-ink"
				>
					복사
				</button>
			</div>
			<Button variant="kakao" className="gap-2" onClick={() => void handleShare()}>
				<MessageCircle className="size-5" fill="currentColor" strokeWidth={0} aria-hidden="true" />
				카카오톡으로 공유
			</Button>
			{roomId && <AiMemberButton roomId={roomId} />}
			<button type="button" onClick={onLater ?? onClose} className="text-center text-control text-mute">
				나중에 하기
			</button>
			{toast && (
				<div className="pointer-events-none absolute inset-x-0 bottom-full flex justify-center px-5 pb-3">
					<Toast>{toast}</Toast>
				</div>
			)}
		</BottomSheet>
	);
}
