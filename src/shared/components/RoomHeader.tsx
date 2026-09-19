import { MoreHorizontal } from "lucide-react";

import { AvatarStack } from "../ui/AvatarStack";
import { IconButton } from "../ui/IconButton";
import { BackHeader } from "./BackHeader";

const MORE_LABEL = "더보기";

type RoomHeaderProps = {
	roomName: string;
	memberNames: string[];
	onBack?: () => void;
	onOpenInfo?: () => void;
};

export function RoomHeader({ roomName, memberNames, onBack, onOpenInfo }: RoomHeaderProps) {
	return (
		<BackHeader title={roomName} onBack={onBack}>
			<AvatarStack names={memberNames} />
			{onOpenInfo && (
				<IconButton label={MORE_LABEL} onClick={onOpenInfo}>
					<MoreHorizontal className="size-4" strokeWidth={2.5} aria-hidden="true" />
				</IconButton>
			)}
		</BackHeader>
	);
}
