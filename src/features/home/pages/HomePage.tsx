import { useQueries, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import type { ApiError } from "@/shared/api/api-error";
import { memberQueries } from "@/shared/api/members";
import { postQueries, type RoomPostSummary } from "@/shared/api/posts";
import { type Room, roomQueries } from "@/shared/api/rooms";
import { EmptyState } from "@/shared/components/EmptyState";
import { HomeHeader } from "@/shared/components/HomeHeader";
import { RoomCard } from "@/shared/components/RoomCard";
import { formatVoteDeadlineLabel } from "@/shared/domain/room";
import { useMyMonthStats } from "@/shared/hooks/useMyMonthStats";
import { isOnboardingSkipped } from "@/shared/lib/onboarding-skip";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { Reveal } from "@/shared/ui/Reveal";
import { StickyCta } from "@/shared/ui/StickyCta";
import { kstCalendar } from "@/shared/utils/date";
import { formatAmount } from "@/shared/utils/format";

import { ProfileSummaryCard } from "../components/ProfileSummaryCard";
import { RoomJoinSheet } from "../components/RoomJoinSheet";

type QueryFailure = {
	isError: boolean;
	error: ApiError | null;
};

type RoomCardItem = {
	room: Room;
	memberCount: number | undefined;
	latestPost: RoomPostSummary | null;
};

function firstErrorOf(queries: QueryFailure[]) {
	return queries.find((query) => query.isError)?.error ?? null;
}

function formatRecentPost(post: RoomPostSummary) {
	return `${post.authorNickname}: ${post.item} ${formatAmount(post.amountKrw)}원`;
}

function compareByRecentPost(a: RoomCardItem, b: RoomCardItem) {
	if (a.latestPost === null) {
		return b.latestPost === null ? 0 : 1;
	}

	if (b.latestPost === null) {
		return -1;
	}

	return new Date(b.latestPost.createdAt).getTime() - new Date(a.latestPost.createdAt).getTime();
}

export function HomePage() {
	const navigate = useNavigate();
	const stats = useMyMonthStats();
	const rooms = useQuery(roomQueries.list());
	const [joinOpen, setJoinOpen] = useState(false);

	const profile = stats.profile;
	const roomList = rooms.data ?? [];
	const members = useQueries({
		queries: roomList.map((room) => memberQueries.list(room.id))
	});
	const feeds = useQueries({
		queries: roomList.map((room) => postQueries.feed(room.id))
	});

	const roomItems: RoomCardItem[] = roomList.map((room, index) => ({
		room,
		memberCount: members[index].data?.length,
		latestPost: feeds[index].data?.[0] ?? null
	}));
	const feedsSettled = feeds.every((feed) => !feed.isPending);
	const sortedRoomItems = feedsSettled ? [...roomItems].sort(compareByRecentPost) : roomItems;
	const membersError = firstErrorOf(members);
	const monthLabel = `${kstCalendar(new Date()).month}월 지출`;
	const needsProfile = !stats.isPending && stats.error === null && profile === null;
	const needsOnboarding = needsProfile && !isOnboardingSkipped();

	useEffect(() => {
		if (needsOnboarding) {
			void navigate("/onboarding/budget", { replace: true });
		}
	}, [needsOnboarding, navigate]);

	return (
		<div className="flex flex-1 flex-col">
			<div className="px-5">
				<HomeHeader
					profileName={profile?.nickname ?? ""}
					profileImageUrl={profile?.avatarUrl}
					onProfile={() => void navigate("/me")}
				/>
			</div>

			<div className="flex flex-1 flex-col gap-3.5 px-5 pt-1.5">
				{stats.isPending && (
					<Card role="status" className="p-4.5 text-chip text-mute">
						프로필을 불러오는 중
					</Card>
				)}
				{stats.summaryError && <Alert>{stats.summaryError.message}</Alert>}

				{!stats.isPending && profile && (
					<Reveal>
						<ProfileSummaryCard
							name={profile.nickname}
							imageUrl={profile.avatarUrl}
							tier={stats.tier}
							nextTierLabel={stats.nextTierLabel}
							score={stats.score}
							monthLabel={monthLabel}
							spent={stats.spentThisMonth}
							budget={profile.monthlyBudget}
							baseline={stats.baseline ?? undefined}
						/>
					</Reveal>
				)}

				{needsProfile && !needsOnboarding && (
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
				{membersError && <Alert>{membersError.message}</Alert>}
				{rooms.isSuccess && roomList.length === 0 && <EmptyState title="친구들과 거지방을 만들어보세요" />}

				{sortedRoomItems.map(({ room, memberCount, latestPost }, index) => (
					<Reveal key={room.id} index={index + 2}>
						<RoomCard
							roomName={room.name}
							intensity={room.spiceLevel}
							deadlineLabel={`${formatVoteDeadlineLabel(room.voteDeadlineMinutes)} 재판`}
							memberCount={memberCount}
							recentActivity={latestPost ? formatRecentPost(latestPost) : undefined}
							onClick={() => void navigate(`/rooms/${room.id}`)}
						/>
					</Reveal>
				))}
			</div>

			<StickyCta
				label="+ 거지방 만들기"
				onClick={() => void navigate("/rooms/new")}
				secondaryLabel="코드로 참여"
				onSecondaryClick={() => setJoinOpen(true)}
				className="sticky-cta"
			/>

			<RoomJoinSheet open={joinOpen} onClose={() => setJoinOpen(false)} />
		</div>
	);
}
