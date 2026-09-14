import { useNavigate } from "react-router";

import { BackHeader } from "@/shared/components/BackHeader";
import { Alert } from "@/shared/ui/Alert";
import { StickyCta } from "@/shared/ui/StickyCta";

const MISSING_ROOM_MESSAGE = "방 정보가 없습니다";

type RoomMissingNoticeProps = {
	title: string;
};

export function RoomMissingNotice({ title }: RoomMissingNoticeProps) {
	const navigate = useNavigate();

	return (
		<div className="flex flex-1 flex-col px-5 pb-8.5">
			<BackHeader title={title} onBack={() => void navigate(-1)} />
			<div className="flex flex-1 flex-col gap-4.5 pt-1.5">
				<Alert>{MISSING_ROOM_MESSAGE}</Alert>
				<div className="mt-auto">
					<StickyCta label="홈으로 가기" onClick={() => void navigate("/")} />
				</div>
			</div>
		</div>
	);
}
