import { useNavigate } from "react-router";

import { HomeHeader } from "@/shared/components/HomeHeader";
import { RoomCard } from "@/shared/components/RoomCard";
import { Reveal } from "@/shared/ui/Reveal";
import { StickyCta } from "@/shared/ui/StickyCta";

import { ProfileSummaryCard } from "../components/ProfileSummaryCard";

const ME = {
	name: "소윤",
	tier: "flower",
	nextTierLabel: "거지왕까지 14점",
	score: 71,
	monthLabel: "9월 지출",
	spent: 412000,
	budget: 500000,
	noSpendDays: 6,
	imprisonment: { daysLeft: 2, totalDays: 3 }
} as const;

const ROOMS = [
	{
		id: 1,
		roomName: "야근족 거지방",
		intensity: "spicy",
		unreadCount: 3,
		memberCount: 5,
		recentActivity: "지민, 배달 24,000원 투표 중"
	},
	{
		id: 2,
		roomName: "자취방 절약단",
		intensity: "mild",
		unreadCount: 0,
		memberCount: 3,
		recentActivity: "현우, 살까 말까 에어팟 기각"
	}
] as const;

export function HomePage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-1 flex-col pb-11">
			<div className="px-5">
				<HomeHeader profileName={ME.name} onProfile={() => navigate("/me")} />
			</div>

			<div className="flex flex-1 flex-col gap-3.5 px-5 pt-1.5">
				<Reveal>
					<ProfileSummaryCard {...ME} />
				</Reveal>

				<Reveal index={1} className="flex items-baseline justify-between gap-2">
					<h2 className="text-base font-black text-ink">내 거지방</h2>
					<span className="text-xs text-dim">{ROOMS.length}개, 최근 활동순</span>
				</Reveal>

				{ROOMS.map((room, index) => (
					<Reveal key={room.id} index={index + 2}>
						<RoomCard
							roomName={room.roomName}
							intensity={room.intensity}
							unreadCount={room.unreadCount}
							memberCount={room.memberCount}
							recentActivity={room.recentActivity}
							onClick={() => navigate(`/rooms/${room.id}`)}
						/>
					</Reveal>
				))}
			</div>

			<StickyCta label="+ 거지방 만들기" onClick={() => navigate("/rooms/new")} className="sticky-cta" />
		</div>
	);
}
