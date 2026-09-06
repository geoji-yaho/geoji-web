import { cva, type VariantProps } from "class-variance-authority";

import type { ImageSource } from "../domain/post";
import { cn } from "../lib/cn";

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
	meme?: ImageSource;
	className?: string;
};

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
