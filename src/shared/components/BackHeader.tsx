import { ChevronLeft, X } from "lucide-react";
import type { PropsWithChildren } from "react";

import { IconButton } from "../ui/IconButton";

type BackHeaderProps = PropsWithChildren<{
	title: string;
	secondaryText?: string;
	leftIcon?: "back" | "close";
	onBack?: () => void;
}>;

export function BackHeader({ title, secondaryText, leftIcon = "back", onBack, children }: BackHeaderProps) {
	const closing = leftIcon === "close";
	const LeftIcon = closing ? X : ChevronLeft;

	return (
		<header className="flex items-center gap-3 py-3">
			<IconButton label={closing ? "닫기" : "뒤로 가기"} onClick={onBack}>
				<LeftIcon className="size-4" strokeWidth={2.5} aria-hidden="true" />
			</IconButton>
			<h1 className="flex-1 truncate text-title text-ink">{title}</h1>
			{secondaryText && <span className="text-caption text-dim">{secondaryText}</span>}
			{children}
		</header>
	);
}
