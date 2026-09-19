import { AvatarStack } from "../ui/AvatarStack";
import { BackHeader } from "./BackHeader";

type RoomHeaderProps = {
	roomName: string;
	memberNames: string[];
	onBack?: () => void;
};

export function RoomHeader({ roomName, memberNames, onBack }: RoomHeaderProps) {
	return (
		<BackHeader title={roomName} onBack={onBack}>
			<AvatarStack names={memberNames} />
		</BackHeader>
	);
}
