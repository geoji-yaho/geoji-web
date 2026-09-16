import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { roomQueries } from "@/shared/api/rooms";
import { IntensityTag } from "@/shared/components/IntensityTag";
import { formatVoteDeadlineLabel } from "@/shared/domain/room";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { StickyCta } from "@/shared/ui/StickyCta";

import { RoomRuleList } from "../components/RoomRuleList";
import { useJoinRoom } from "../hooks/useJoinRoom";

const EXPIRED_MESSAGE = "만료된 초대 링크입니다";

export function RoomJoinPage() {
	const navigate = useNavigate();
	const { code } = useParams<{ code: string }>();
	const join = useJoinRoom();
	const preview = useQuery({ ...roomQueries.invite(code ?? ""), enabled: Boolean(code) });

	const room = preview.data ?? null;
	// 없는 코드·삭제된 방은 서버가 400 으로 답한다. 참여 실패도 같은 문구를 쓴다.
	// code 가 비면 쿼리를 걸지 않아 isPending 이 풀리지 않으므로 같이 만료로 본다
	const expired = !code || preview.error?.kind === "badRequest" || join.error?.kind === "badRequest";

	// 이미 멤버면 초대장을 보여줄 것 없이 방으로 보낸다
	useEffect(() => {
		if (room?.alreadyMember) {
			void navigate(`/rooms/${room.id}`, { replace: true });
		}
	}, [room, navigate]);

	const submit = () => {
		if (!code) {
			return;
		}
		join.mutate(code, { onSuccess: (joined) => void navigate(`/rooms/${joined.id}`, { replace: true }) });
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

			{preview.isPending && (
				<Card role="status" className="p-4.5 text-chip text-mute">
					초대장을 불러오는 중
				</Card>
			)}

			{preview.error && <Alert>{preview.error.message}</Alert>}

			{room && (
				<Card className="flex flex-col gap-3.5 p-4.5">
					<div className="flex items-start justify-between gap-3">
						<div>
							<h2 className="text-headline text-ink">{room.name}</h2>
							<p className="mt-1 text-chip text-mute">
								방장 {room.ownerNickname}, 멤버 {room.memberCount}, 마감{" "}
								{formatVoteDeadlineLabel(room.voteDeadlineMinutes)}
							</p>
						</div>
						<IntensityTag intensity={room.spiceLevel} />
					</div>
					<span aria-hidden="true" className="h-px bg-line" />
					<div className="flex flex-col gap-2">
						<span className="text-label text-mute">방 규칙</span>
						<RoomRuleList rules={room.rules} />
					</div>
				</Card>
			)}

			<Alert tone="fill">참여하면 내 지출이 이 방 멤버들에게 공개됩니다</Alert>

			{join.isError && <Alert>{join.error.message}</Alert>}

			<div className="mt-auto flex flex-col gap-3">
				<StickyCta
					label={join.isPending ? "참여하는 중" : "참여하기"}
					onClick={submit}
					disabled={!code || room === null || join.isPending}
				/>
				<Link to="/" className="text-center text-control text-mute">
					취소
				</Link>
			</div>
		</div>
	);
}
