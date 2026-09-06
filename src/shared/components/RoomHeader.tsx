import { EllipsisVertical } from "lucide-react";

import { AvatarStack } from "../ui/AvatarStack";
import { IconButton } from "../ui/IconButton";
import { BackHeader } from "./BackHeader";

type RoomHeaderProps = {
	roomName: string;
	memberNames: string[];
	onBack?: () => void;
	onMore?: () => void;
};

export function RoomHeader({ roomName, memberNames, onBack, onMore }: RoomHeaderProps) {
	return (
		<BackHeader title={roomName} onBack={onBack}>
			<AvatarStack names={memberNames} />
			<IconButton label="방 메뉴 더보기" onClick={onMore}>
				<EllipsisVertical className="size-4" aria-hidden="true" />
			</IconButton>
		</BackHeader>
	);
}
