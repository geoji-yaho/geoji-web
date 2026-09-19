import { MoreHorizontal } from "lucide-react";

import { AvatarStack, type AvatarStackItem } from "../ui/AvatarStack";
import { IconButton } from "../ui/IconButton";
import { BackHeader } from "./BackHeader";

const MORE_LABEL = "더보기";

type RoomHeaderProps = {
	roomName: string;
	members: AvatarStackItem[];
	onBack?: () => void;
	onOpenInfo?: () => void;
};

export function RoomHeader({ roomName, members, onBack, onOpenInfo }: RoomHeaderProps) {
	return (
		<BackHeader title={roomName} onBack={onBack}>
			<AvatarStack items={members} />
			{onOpenInfo && (
				<IconButton label={MORE_LABEL} onClick={onOpenInfo}>
					<MoreHorizontal className="size-4" strokeWidth={2.5} aria-hidden="true" />
				</IconButton>
			)}
		</BackHeader>
	);
}
