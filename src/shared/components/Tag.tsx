import { cva } from "class-variance-authority";

import { cn } from "../lib/cn";
import { POST_TYPE_LABELS, type PostType } from "../types/post";
import { type Intensity, INTENSITY_LABELS } from "../types/room";

const tagVariants = cva("inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-tag font-black", {
	variants: {
		tone: {
			outline: "border border-line text-mute",
			red: "bg-red text-stamp-text",
			redOutline: "border border-red text-red",
			ink: "bg-ink text-card",
			inkOutline: "border-2 border-ink text-ink"
		}
	}
});

const INTENSITY_TONES = {
	mild: "outline",
	spicy: "red",
	hell: "ink"
} as const;

const POST_TYPE_TONES = {
	spent: "red",
	considering: "inkOutline"
} as const;

type IntensityTagProps = {
	intensity: Intensity;
	className?: string;
};

export function IntensityTag({ intensity, className }: IntensityTagProps) {
	return (
		<span className={cn(tagVariants({ tone: INTENSITY_TONES[intensity] }), className)}>
			{INTENSITY_LABELS[intensity]}
		</span>
	);
}

type PostTypeTagProps = {
	postType: PostType;
	className?: string;
};

export function PostTypeTag({ postType, className }: PostTypeTagProps) {
	return (
		<span className={cn(tagVariants({ tone: POST_TYPE_TONES[postType] }), className)}>
			{POST_TYPE_LABELS[postType]}
		</span>
	);
}

type StatusTagProps = {
	label: string;
	className?: string;
};

/** 방 카드의 투표 마감 시간과 사람 옆의 형 집행 표시. 예: 30분 재판, 수감 중 2일 */
export function StatusTag({ label, className }: StatusTagProps) {
	return <span className={cn(tagVariants({ tone: "redOutline" }), className)}>{label}</span>;
}
