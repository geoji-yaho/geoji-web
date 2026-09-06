import { ChevronLeft, EllipsisVertical } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar } from "./Avatar";
import { AvatarStack } from "./AvatarStack";
import { Logo } from "./Logo";

const ROUND_BUTTON_STYLES = "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-fill text-ink";

type BackHeaderProps = {
	title: string;
	secondaryText?: string;
	onBack?: () => void;
	/** 오른쪽 끝에 놓을 것. 사운드 토글처럼 화면마다 다르다 */
	children?: ReactNode;
};

export function BackHeader({ title, secondaryText, onBack, children }: BackHeaderProps) {
	return (
		<header className="flex items-center gap-3 py-3">
			<button type="button" aria-label="뒤로 가기" onClick={onBack} className={ROUND_BUTTON_STYLES}>
				<ChevronLeft className="size-4" strokeWidth={2.5} aria-hidden="true" />
			</button>
			<h1 className="flex-1 truncate text-title text-ink">{title}</h1>
			{secondaryText && <span className="text-caption text-dim">{secondaryText}</span>}
			{children}
		</header>
	);
}

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
			<button type="button" aria-label="방 메뉴 더보기" onClick={onMore} className={ROUND_BUTTON_STYLES}>
				<EllipsisVertical className="size-4" aria-hidden="true" />
			</button>
		</BackHeader>
	);
}

type HomeHeaderProps = {
	profileName: string;
	onProfile?: () => void;
};

export function HomeHeader({ profileName, onProfile }: HomeHeaderProps) {
	return (
		<header className="flex items-center justify-between py-3">
			<Logo />
			<button type="button" aria-label="마이페이지" onClick={onProfile} className="rounded-full">
				<Avatar name={profileName} />
			</button>
		</header>
	);
}
