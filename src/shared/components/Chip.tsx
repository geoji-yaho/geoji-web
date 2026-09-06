import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "../lib/cn";

const chipVariants = cva(
	"inline-flex shrink-0 items-center justify-center rounded-full px-3.5 py-2 text-chip text-mute transition-colors",
	{
		variants: {
			selected: {
				true: "font-black",
				false: "bg-fill"
			},
			/** 선택됐을 때의 색. 카테고리와 프리셋은 잉크, 투표 마감 시간은 테라코타 외곽선 */
			tone: {
				ink: "",
				red: ""
			}
		},
		compoundVariants: [
			{ selected: true, tone: "ink", className: "bg-ink text-card" },
			{ selected: true, tone: "red", className: "border-2 border-red bg-red/10 text-xs text-red" }
		],
		defaultVariants: {
			selected: false,
			tone: "ink"
		}
	}
);

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> &
	VariantProps<typeof chipVariants> & {
		selected?: boolean;
	};

export function Chip({ className, selected = false, tone, ...props }: ChipProps) {
	return (
		<button
			type="button"
			aria-pressed={selected}
			className={cn(chipVariants({ selected, tone }), className)}
			{...props}
		/>
	);
}
