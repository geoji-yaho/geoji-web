import { Link, useNavigate, useParams } from "react-router";

import { IntensityTag } from "@/shared/components/IntensityTag";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { StickyCta } from "@/shared/ui/StickyCta";

import { RoomRuleList } from "../components/RoomRuleList";
import { useJoinRoom } from "../hooks/useJoinRoom";

const ROOM = {
	name: "야근족 거지방",
	owner: "지민",
	memberCount: 5,
	intensity: "spicy",
	deadlineLabel: "12시간"
} as const;
const ROOM_RULES = ["한 달에 배달음식 1번", "커피는 하루 1잔", "충동구매 금지"];

const EXPIRED_MESSAGE = "만료된 초대 링크입니다";

export function RoomJoinPage() {
	const navigate = useNavigate();
	const { code } = useParams<{ code: string }>();
	const join = useJoinRoom();

	const expired = join.error?.kind === "badRequest";

	const submit = () => {
		if (!code) return;
		join.mutate(code, { onSuccess: (room) => void navigate(`/rooms/${room.id}`) });
	};

	if (expired) {
		return (
			<div className="flex flex-1 flex-col gap-4.5 px-5 pt-4 pb-8.5">
				<Alert>{EXPIRED_MESSAGE}</Alert>
				<div className="mt-auto">
					<StickyCta label="홈으로 가기" onClick={() => void navigate("/")} />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4.5 px-5 pt-4 pb-8.5">
			<h1 className="text-wordmark text-ink">초대장이 도착했습니다</h1>

			<Card className="flex flex-col gap-3.5 p-4.5">
				<div className="flex items-start justify-between gap-3">
					<div>
						<h2 className="text-headline text-ink">{ROOM.name}</h2>
						<p className="mt-1 text-chip text-mute">
							방장 {ROOM.owner}, 멤버 {ROOM.memberCount}, 마감 {ROOM.deadlineLabel}
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

			{join.isError && <Alert>{join.error.message}</Alert>}

			<div className="mt-auto flex flex-col gap-3">
				<StickyCta
					label={join.isPending ? "참여하는 중" : "참여하기"}
					onClick={submit}
					disabled={!code || join.isPending}
				/>
				<Link to="/" className="text-center text-control text-mute">
					취소
				</Link>
			</div>
		</div>
	);
}
