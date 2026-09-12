import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { profileQueries } from "@/shared/api/profile";
import { INTENSITY_BY_SPICE_LEVEL, roomQueries } from "@/shared/api/rooms";
import { EmptyState } from "@/shared/components/EmptyState";
import { HomeHeader } from "@/shared/components/HomeHeader";
import { RoomCard } from "@/shared/components/RoomCard";
import { formatVoteDeadlineLabel } from "@/shared/domain/room";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { Reveal } from "@/shared/ui/Reveal";
import { StickyCta } from "@/shared/ui/StickyCta";

import { ProfileSummaryCard } from "../components/ProfileSummaryCard";

const SAMPLE_SUMMARY = {
	tier: "flower",
	nextTierLabel: "거지왕까지 14점",
	score: 71,
	monthLabel: "9월 지출",
	spent: 412000,
	noSpendDays: 6,
	imprisonment: { daysLeft: 2, totalDays: 3 }
} as const;

export function HomePage() {
	const navigate = useNavigate();
	const me = useQuery(profileQueries.me());
	const rooms = useQuery(roomQueries.list());

	const profile = me.data ?? null;
	const roomList = rooms.data ?? [];

	return (
		<div className="flex flex-1 flex-col pb-11">
			<div className="px-5">
				<HomeHeader profileName={profile?.nickname ?? ""} onProfile={() => void navigate("/me")} />
			</div>

			<div className="flex flex-1 flex-col gap-3.5 px-5 pt-1.5">
				{me.isPending && (
					<Card role="status" className="p-4.5 text-chip text-mute">
						프로필을 불러오는 중
					</Card>
				)}
				{me.isError && <Alert>{me.error.message}</Alert>}

				{profile && (
					<Reveal>
						<ProfileSummaryCard {...SAMPLE_SUMMARY} name={profile.nickname} budget={profile.monthlyBudget} />
					</Reveal>
				)}

				{me.isSuccess && !profile && (
					<Reveal>
						<button
							type="button"
							onClick={() => void navigate("/onboarding/budget")}
							className="flex w-full pressable flex-col gap-1 rounded-card bg-card p-4.5 text-left shadow-card"
						>
							<span className="text-subtitle text-ink">한 달에 얼마까지 쓸 건가요?</span>
							<span className="text-chip text-mute">넘기면 배심원들이 알게 됩니다</span>
						</button>
					</Reveal>
				)}

				<Reveal index={1} className="flex items-baseline justify-between gap-2">
					<h2 className="text-base font-black text-ink">내 거지방</h2>
					{rooms.isSuccess && <span className="text-xs text-dim">{roomList.length}개</span>}
				</Reveal>

				{rooms.isPending && (
					<Card role="status" className="p-4.5 text-chip text-mute">
						방 목록을 불러오는 중
					</Card>
				)}
				{rooms.isError && <Alert>{rooms.error.message}</Alert>}
				{rooms.isSuccess && roomList.length === 0 && <EmptyState title="친구들과 거지방을 만들어보세요" />}

				{roomList.map((room, index) => (
					<Reveal key={room.id} index={index + 2}>
						<RoomCard
							roomName={room.name}
							intensity={INTENSITY_BY_SPICE_LEVEL[room.spiceLevel]}
							deadlineLabel={`${formatVoteDeadlineLabel(room.voteDeadlineMinutes)} 재판`}
							onClick={() => void navigate(`/rooms/${room.id}`)}
						/>
					</Reveal>
				))}
			</div>

			<StickyCta label="+ 거지방 만들기" onClick={() => void navigate("/rooms/new")} className="sticky-cta" />
		</div>
	);
}
