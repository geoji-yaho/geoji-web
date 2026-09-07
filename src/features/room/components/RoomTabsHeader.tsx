import { useLocation, useNavigate, useParams } from "react-router";

import { RoomHeader } from "@/shared/components/RoomHeader";
import { TabSegment } from "@/shared/ui/TabSegment";

const TAB_SEGMENTS = ["", "ranking", "info"] as const;

type TabSegmentValue = (typeof TAB_SEGMENTS)[number];

const TAB_LABELS: Record<TabSegmentValue, string> = {
	"": "피드",
	ranking: "랭킹",
	info: "방 정보"
};

function currentSegment(pathname: string, roomId: string): TabSegmentValue {
	const tail = pathname.split(`/rooms/${roomId}`)[1]?.replace(/^\/|\/$/g, "") ?? "";

	return TAB_SEGMENTS.find((segment) => segment === tail) ?? "";
}

type RoomTabsHeaderProps = {
	roomName: string;
	memberNames: string[];
};

export function RoomTabsHeader({ roomName, memberNames }: RoomTabsHeaderProps) {
	const { roomId = "1" } = useParams();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	return (
		<div className="px-5">
			<RoomHeader roomName={roomName} memberNames={memberNames} onBack={() => navigate(-1)} />
			<TabSegment
				tabs={TAB_SEGMENTS}
				value={currentSegment(pathname, roomId)}
				renderLabel={(segment) => TAB_LABELS[segment]}
				onChange={(segment) => navigate(`/rooms/${roomId}${segment ? `/${segment}` : ""}`, { replace: true })}
			/>
		</div>
	);
}
