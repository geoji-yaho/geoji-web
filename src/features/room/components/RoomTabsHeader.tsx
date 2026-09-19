import { useLocation, useNavigate } from "react-router";

import { RoomHeader } from "@/shared/components/RoomHeader";
import { roomInfoPath } from "@/shared/constants/routes";
import type { AvatarStackItem } from "@/shared/ui/AvatarStack";
import { TabSegment } from "@/shared/ui/TabSegment";

const TAB_SEGMENTS = ["", "ranking", "info"] as const;

type TabSegmentValue = (typeof TAB_SEGMENTS)[number];

const TAB_LABELS: Record<TabSegmentValue, string> = {
	"": "피드",
	ranking: "랭킹",
	info: "방 정보"
};

function currentSegment(pathname: string, roomId: string) {
	const tail = pathname.split(`/rooms/${roomId}`)[1]?.replace(/^\/|\/$/g, "") ?? "";

	return TAB_SEGMENTS.find((segment) => segment === tail) ?? "";
}

type RoomTabsHeaderProps = {
	roomId: string;
	roomName: string;
	members: AvatarStackItem[];
};

export function RoomTabsHeader({ roomId, roomName, members }: RoomTabsHeaderProps) {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	return (
		<div className="px-5">
			<RoomHeader
				roomName={roomName}
				members={members}
				onBack={() => void navigate("/")}
				onOpenInfo={() => void navigate(roomInfoPath(roomId), { replace: true })}
			/>
			<TabSegment
				tabs={TAB_SEGMENTS}
				value={currentSegment(pathname, roomId)}
				renderLabel={(segment) => TAB_LABELS[segment]}
				onChange={(segment) => void navigate(`/rooms/${roomId}${segment ? `/${segment}` : ""}`, { replace: true })}
			/>
		</div>
	);
}
