import { useState } from "react";
import { useNavigate } from "react-router";

import { Alert } from "@/shared/ui/Alert";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";

import { useLeaveRoom } from "../hooks/useLeaveRoom";
import { useRemoveRoom } from "../hooks/useRemoveRoom";

type RoomExitAction = "leave" | "remove";

const REJOIN_NOTE = "다시 들어오려면 초대 링크가 필요합니다.";

const EXIT_COPY = {
	leave: {
		title: "방 나가기",
		confirmLabel: "나가기",
		pendingLabel: "나가는 중"
	},
	remove: {
		title: "방 삭제",
		confirmLabel: "삭제",
		pendingLabel: "삭제하는 중"
	}
} as const satisfies Record<RoomExitAction, { title: string; confirmLabel: string; pendingLabel: string }>;

type RoomExitActionsProps = {
	roomId: string;
	canRemoveRoom: boolean;
};

function buildExitMessage(action: RoomExitAction, canRemoveRoom: boolean) {
	if (action === "remove") {
		return "이 방을 삭제할까요? 멤버 모두가 더는 이 방에 들어올 수 없습니다. 지난 판결 기록은 남습니다.";
	}

	return canRemoveRoom
		? `이 방에서 나갈까요? 방장이 나가도 방은 삭제되지 않습니다. ${REJOIN_NOTE}`
		: `이 방에서 나갈까요? ${REJOIN_NOTE}`;
}

export function RoomExitActions({ roomId, canRemoveRoom }: RoomExitActionsProps) {
	const navigate = useNavigate();
	const leaveRoom = useLeaveRoom();
	const removeRoom = useRemoveRoom();
	const [action, setAction] = useState<RoomExitAction>("leave");
	const [sheetOpen, setSheetOpen] = useState(false);

	const mutation = action === "remove" ? removeRoom : leaveRoom;
	const copy = EXIT_COPY[action];

	const openSheet = (next: RoomExitAction) => {
		setAction(next);
		setSheetOpen(true);
	};

	const closeSheet = () => {
		if (mutation.isPending) {
			return;
		}

		setSheetOpen(false);
		leaveRoom.reset();
		removeRoom.reset();
	};

	const submitSheet = () => {
		mutation.mutate(roomId, { onSuccess: () => void navigate("/", { replace: true }) });
	};

	return (
		<>
			<div className="mt-auto flex gap-2 pt-2">
				<Button variant="outline" onClick={() => openSheet("leave")}>
					방 나가기
				</Button>
				{canRemoveRoom && (
					<Button variant="danger" onClick={() => openSheet("remove")}>
						방 삭제
					</Button>
				)}
			</div>

			<BottomSheet open={sheetOpen} onClose={closeSheet} title={copy.title}>
				<p className="text-chip text-mute">{buildExitMessage(action, canRemoveRoom)}</p>
				{mutation.isError && <Alert>{mutation.error.message}</Alert>}
				<div className="flex gap-2">
					<Button variant="outline" onClick={closeSheet} disabled={mutation.isPending}>
						취소
					</Button>
					<Button variant="danger" onClick={submitSheet} disabled={mutation.isPending}>
						{mutation.isPending ? copy.pendingLabel : copy.confirmLabel}
					</Button>
				</div>
			</BottomSheet>
		</>
	);
}
