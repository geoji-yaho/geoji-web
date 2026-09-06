import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";

import { cn } from "../lib/cn";

const alertVariants = cva("flex items-start gap-2 rounded-2xl px-3.75 py-3.25 text-chip", {
	variants: {
		tone: {
			red: "border border-red bg-red/10 text-red",
			fill: "bg-fill text-mute"
		}
	},
	defaultVariants: {
		tone: "red"
	}
});

const alertIconVariants = cva("font-black", {
	variants: {
		tone: {
			red: "",
			fill: "text-red"
		}
	},
	defaultVariants: {
		tone: "red"
	}
});

type AlertTone = NonNullable<VariantProps<typeof alertVariants>["tone"]>;

type AlertProps = PropsWithChildren<{
	tone?: AlertTone;
	className?: string;
}>;

export function Alert({ children, tone = "red", className }: AlertProps) {
	return (
		<div role={tone === "red" ? "alert" : undefined} className={cn(alertVariants({ tone }), className)}>
			<span aria-hidden="true" className={alertIconVariants({ tone })}>
				!
			</span>
			<span>{children}</span>
		</div>
	);
}
