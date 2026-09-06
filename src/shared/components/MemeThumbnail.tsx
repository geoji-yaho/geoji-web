import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";
import type { ImageSource } from "../types/post";

const memeThumbnailVariants = cva("shrink-0 overflow-hidden bg-fill", {
	variants: {
		size: {
			sm: "size-14 rounded-xl",
			lg: "aspect-square w-full rounded-card"
		}
	},
	defaultVariants: {
		size: "sm"
	}
});

type MemeThumbnailProps = VariantProps<typeof memeThumbnailVariants> & {
	/** 비우면 짤 자리만 남는다 */
	meme?: ImageSource;
	className?: string;
};

/** 판결 짤. 자체 제작 세트에서 AI가 고른 한 장이 들어오는 자리다 */
export function MemeThumbnail({ meme, size, className }: MemeThumbnailProps) {
	return (
		<span
			role="img"
			aria-label={meme?.alt ?? "판결 짤 자리"}
			className={cn(memeThumbnailVariants({ size }), className)}
		>
			{meme && <img src={meme.src} alt="" className="size-full object-cover" />}
		</span>
	);
}
