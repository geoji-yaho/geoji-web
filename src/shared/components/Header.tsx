import { Avatar } from "./Avatar";
import { AvatarStack } from "./AvatarStack";
import { ChevronLeftIcon, MoreIcon } from "./icons";

function BackButton() {
	return (
		<button
			type="button"
			aria-label="뒤로 가기"
			className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-ink"
		>
			<ChevronLeftIcon />
		</button>
	);
}

type BackHeaderProps = {
	title: string;
	secondaryText?: string;
};

export function BackHeader({ title, secondaryText }: BackHeaderProps) {
	return (
		<header className="flex items-center gap-3">
			<BackButton />
			<h1 className="flex-1 text-lg font-black text-ink">{title}</h1>
			{secondaryText && <span className="text-sm text-muted">{secondaryText}</span>}
		</header>
	);
}

type RoomHeaderProps = {
	roomName: string;
	memberLabels: string[];
	onMore?: () => void;
};

export function RoomHeader({ roomName, memberLabels, onMore }: RoomHeaderProps) {
	return (
		<header className="flex items-center gap-3">
			<BackButton />
			<h1 className="flex-1 text-lg font-black text-ink">{roomName}</h1>
			<AvatarStack labels={memberLabels} />
			<button
				type="button"
				aria-label="방 메뉴 더보기"
				onClick={onMore}
				className="flex size-9 shrink-0 items-center justify-center text-muted"
			>
				<MoreIcon />
			</button>
		</header>
	);
}

type HomeHeaderProps = {
	wordmark: string;
	profileLabel: string;
};

export function HomeHeader({ wordmark, profileLabel }: HomeHeaderProps) {
	return (
		<header className="flex items-center gap-2">
			<span aria-hidden="true" className="text-2xl">
				💰
			</span>
			<h1 className="flex-1 text-lg font-black text-ink">{wordmark}</h1>
			<Avatar label={profileLabel} highlighted />
		</header>
	);
}
