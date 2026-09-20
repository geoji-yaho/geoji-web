import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";

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
	const [settledSrc, setSettledSrc] = useState<string | null>(null);
	const isLoading = meme !== undefined && settledSrc !== meme.src;

	return (
		<span
			role={meme ? "img" : undefined}
			aria-label={meme?.alt}
			aria-busy={isLoading || undefined}
			aria-hidden={meme ? undefined : true}
			className={cn(memeThumbnailVariants({ size }), isLoading && "animate-pulse", className)}
		>
			{meme && (
				<img
					src={meme.src}
					alt=""
					onLoad={() => setSettledSrc(meme.src)}
					onError={() => setSettledSrc(meme.src)}
					className="size-full object-cover"
				/>
			)}
		</span>
	);
}
