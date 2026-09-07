import { MessageCircle } from "lucide-react";

import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";

type InviteSheetProps = {
	open: boolean;
	onClose: () => void;
	inviteUrl: string;
	onLater?: () => void;
};

export function InviteSheet({ open, onClose, inviteUrl, onLater }: InviteSheetProps) {
	return (
		<BottomSheet open={open} onClose={onClose} title="배심원을 모으세요">
			<p className="text-chip text-mute">링크 7일 유효, 최대 20명</p>
			<div className="flex gap-2">
				<span className="min-w-0 flex-1 truncate rounded-2xl bg-fill px-3.5 py-3 text-control text-mute">
					{inviteUrl}
				</span>
				<button
					type="button"
					className="shrink-0 rounded-xl border border-dim bg-card px-4 text-control font-black text-ink"
				>
					복사
				</button>
			</div>
			<Button variant="kakao" className="gap-2">
				<MessageCircle className="size-5" fill="currentColor" strokeWidth={0} aria-hidden="true" />
				카카오톡으로 공유
			</Button>
			<button type="button" onClick={onLater ?? onClose} className="text-center text-control text-mute">
				나중에 하기
			</button>
		</BottomSheet>
	);
}
