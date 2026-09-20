import { AvatarStack, type AvatarStackItem } from "../ui/AvatarStack";
import { BackHeader } from "./BackHeader";

type RoomHeaderProps = {
	roomName: string;
	members: AvatarStackItem[];
	onBack?: () => void;
};

export function RoomHeader({ roomName, members, onBack }: RoomHeaderProps) {
	return (
		<BackHeader title={roomName} onBack={onBack}>
			<AvatarStack items={members} />
		</BackHeader>
	);
}
