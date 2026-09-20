import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";

import { hasAiMember, memberName, memberQueries, UNKNOWN_MEMBER_NAME } from "@/shared/api/members";
import { profileQueries } from "@/shared/api/profile";
import { roomQueries } from "@/shared/api/rooms";
import { IntensityTag } from "@/shared/components/IntensityTag";
import { formatVoteDeadlineLabel } from "@/shared/domain/room";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { InfoTable } from "@/shared/ui/InfoTable";
import { Reveal } from "@/shared/ui/Reveal";

import { AiMemberButton } from "../components/AiMemberButton";
import { InviteSheet } from "../components/InviteSheet";
import { MemberList } from "../components/MemberList";
import { RoomExitActions } from "../components/RoomExitActions";
import { RoomRuleList } from "../components/RoomRuleList";
import { buildInviteUrl } from "../utils/buildInviteUrl";

export function RoomInfoPage() {
	const { roomId = "" } = useParams();
	const [inviteOpen, setInviteOpen] = useState(false);
	const room = useQuery(roomQueries.detail(roomId));
	const members = useQuery(memberQueries.list(roomId));
	const me = useQuery(profileQueries.me());

	const myUserId = me.data?.id ?? null;
	const owner = members.data?.find((member) => member.userId === room.data?.createdBy);
	const inviteCode = room.data?.inviteCode ?? "";
	const shouldLoadOwnerName = members.isSuccess && owner === undefined && inviteCode !== "";
	const ownerPreview = useQuery({ ...roomQueries.invite(inviteCode), enabled: shouldLoadOwnerName });
	const ownerName = owner ? memberName(owner) : (ownerPreview.data?.ownerNickname ?? UNKNOWN_MEMBER_NAME);
	const canRemoveRoom = myUserId !== null && room.data?.createdBy === myUserId;

	return (
		<>
			<div className="flex flex-1 flex-col gap-3.5 px-5 pt-3 pb-8.5">
				{room.isPending && (
					<Card role="status" className="p-4.5 text-chip text-mute">
						방 정보를 불러오는 중
					</Card>
				)}
				{room.isError && <Alert>{room.error.message}</Alert>}

				{room.isSuccess && (
					<>
						<Reveal>
							<InfoTable
								rows={[
									{ label: "방 이름", value: room.data.name },
									{ label: "방장", value: ownerName, strong: true },
									{
										label: "잔소리 강도",
										value: <IntensityTag intensity={room.data.spiceLevel} />
									},
									{ label: "투표 마감", value: formatVoteDeadlineLabel(room.data.voteDeadlineMinutes) }
								]}
							/>
						</Reveal>

						{room.data.rules.length > 0 && (
							<Reveal as="section" index={1} className="flex flex-col gap-2">
								<h2 className="text-sm font-black text-ink">방 규칙</h2>
								<Card className="px-4 py-1">
									<RoomRuleList rules={room.data.rules} />
								</Card>
							</Reveal>
						)}

						<Reveal as="section" index={2} className="flex flex-col gap-2">
							<div className="flex items-baseline justify-between">
								<h2 className="text-sm font-black text-ink">멤버{members.isSuccess && ` ${members.data.length}`}</h2>
								<span className="text-xs text-dim">이번 달 거지력</span>
							</div>
							{members.isPending && (
								<Card role="status" className="p-4.5 text-chip text-mute">
									멤버를 불러오는 중
								</Card>
							)}
							{members.isError && <Alert>{members.error.message}</Alert>}
							{members.isSuccess && <MemberList members={members.data} myUserId={myUserId} />}
						</Reveal>

						<Button variant="secondary" onClick={() => setInviteOpen(true)}>
							초대 링크 공유
						</Button>
						{members.isSuccess && <AiMemberButton roomId={roomId} isAdded={hasAiMember(members.data)} />}
						<RoomExitActions roomId={roomId} canRemoveRoom={canRemoveRoom} />
					</>
				)}
			</div>

			{room.isSuccess && (
				<InviteSheet
					open={inviteOpen}
					onClose={() => setInviteOpen(false)}
					inviteUrl={buildInviteUrl(room.data.inviteCode)}
				/>
			)}
		</>
	);
}
