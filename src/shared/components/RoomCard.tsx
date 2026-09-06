import { CountBadge, TagBadge } from "./Badge";

type RoomCardProps = {
	roomName: string;
	intensityLabel: string;
	unreadCount: number;
	memberCount: number;
	recentActivity: string;
};

export function RoomCard({ roomName, intensityLabel, unreadCount, memberCount, recentActivity }: RoomCardProps) {
	return (
		<div className="flex flex-col gap-1 rounded-2xl bg-card p-4">
			<div className="flex items-center gap-2">
				<span className="flex-1 font-bold text-ink">{roomName}</span>
				<TagBadge label={intensityLabel} />
				<CountBadge count={unreadCount} />
			</div>
			<span className="text-sm text-muted">{recentActivity}</span>
			<span className="text-xs text-muted">멤버 {memberCount}</span>
		</div>
	);
}
