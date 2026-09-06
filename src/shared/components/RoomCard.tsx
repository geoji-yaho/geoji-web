import { cn } from "../lib/cn";
import type { Intensity } from "../types/room";
import { CountBadge } from "./CountBadge";
import { IntensityTag, StatusTag } from "./Tag";

type RoomCardProps = {
	roomName: string;
	intensity: Intensity;
	/** 투표 마감 시간 뱃지. 예: 30분 재판 */
	deadlineLabel?: string;
	unreadCount: number;
	memberCount: number;
	recentActivity: string;
	onClick?: () => void;
	className?: string;
};

export function RoomCard({
	roomName,
	intensity,
	deadlineLabel,
	unreadCount,
	memberCount,
	recentActivity,
	onClick,
	className
}: RoomCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn("flex w-full flex-col gap-2 rounded-card bg-card p-4 text-left shadow-card", className)}
		>
			<span className="flex w-full items-center gap-2">
				<span className="min-w-0 flex-1 truncate text-subtitle text-ink">{roomName}</span>
				<IntensityTag intensity={intensity} />
				{deadlineLabel && <StatusTag label={deadlineLabel} />}
				{unreadCount > 0 && <CountBadge count={unreadCount} />}
			</span>
			<span className="truncate text-chip text-text">{recentActivity}</span>
			<span className="text-caption text-dim">멤버 {memberCount}명</span>
		</button>
	);
}
