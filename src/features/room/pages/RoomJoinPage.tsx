import { Link, useNavigate } from "react-router";

import { IntensityTag } from "@/shared/components/IntensityTag";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { StickyCta } from "@/shared/ui/StickyCta";

import { RoomRuleList } from "../components/RoomRuleList";

const ROOM = { id: "1", name: "야근족 거지방", owner: "지민", memberCount: 5, intensity: "spicy" } as const;
const ROOM_RULES = ["한 달에 배달음식 1번", "커피는 하루 1잔", "충동구매 금지"];

export function RoomJoinPage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-1 flex-col gap-4.5 px-5 pt-4 pb-8.5">
			<h1 className="text-wordmark text-ink">초대장이 도착했습니다</h1>

			<Card className="flex flex-col gap-3.5 p-4.5">
				<div className="flex items-start justify-between gap-3">
					<div>
						<h2 className="text-headline text-ink">{ROOM.name}</h2>
						<p className="mt-1 text-chip text-mute">
							방장 {ROOM.owner}, 멤버 {ROOM.memberCount}
						</p>
					</div>
					<IntensityTag intensity={ROOM.intensity} />
				</div>
				<span aria-hidden="true" className="h-px bg-line" />
				<div className="flex flex-col gap-2">
					<span className="text-label text-mute">방 규칙</span>
					<RoomRuleList rules={ROOM_RULES} />
				</div>
			</Card>

			<Alert tone="fill">참여하면 내 지출이 이 방 멤버들에게 공개됩니다</Alert>

			<div className="mt-auto flex flex-col gap-3">
				<StickyCta label="피고인으로 참여하기" onClick={() => navigate(`/rooms/${ROOM.id}`)} />
				<Link to="/" className="text-center text-control text-mute">
					취소
				</Link>
			</div>
		</div>
	);
}
