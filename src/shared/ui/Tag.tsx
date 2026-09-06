import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";

import { cn } from "../lib/cn";

const tagVariants = cva("inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-tag font-black", {
	variants: {
		tone: {
			outline: "border border-line text-mute",
			red: "bg-red text-stamp-text",
			redOutline: "border border-red text-red",
			ink: "bg-ink text-card",
			inkOutline: "border-2 border-ink text-ink"
		}
	},
	defaultVariants: {
		tone: "outline"
	}
});

export type TagTone = NonNullable<VariantProps<typeof tagVariants>["tone"]>;

type TagProps = PropsWithChildren<{
	tone?: TagTone;
	className?: string;
}>;

export function Tag({ tone, children, className }: TagProps) {
	return <span className={cn(tagVariants({ tone }), className)}>{children}</span>;
}
