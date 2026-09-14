import type { Intensity } from "../domain/room";
import { cn } from "../lib/cn";
import { CountBadge } from "../ui/CountBadge";
import { IntensityTag } from "./IntensityTag";
import { StatusTag } from "./StatusTag";

type RoomCardProps = {
	roomName: string;
	intensity: Intensity;
	deadlineLabel?: string;
	unreadCount?: number;
	memberCount?: number;
	recentActivity?: string;
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
			className={cn("flex w-full pressable flex-col gap-2 rounded-card bg-card p-4 text-left shadow-card", className)}
		>
			<span className="flex w-full items-center gap-2">
				<span className="min-w-0 flex-1 truncate text-subtitle text-ink">{roomName}</span>
				<IntensityTag intensity={intensity} />
				{deadlineLabel && <StatusTag label={deadlineLabel} />}
				{unreadCount !== undefined && unreadCount > 0 && <CountBadge count={unreadCount} />}
			</span>
			{recentActivity && <span className="truncate text-chip text-text">{recentActivity}</span>}
			{memberCount !== undefined && <span className="text-caption text-dim">멤버 {memberCount}명</span>}
		</button>
	);
}
