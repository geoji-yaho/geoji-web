import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";
import { LogoIcon } from "./LogoIcon";

const logoIconVariants = cva("", {
	variants: {
		size: {
			header: "size-7.5",
			display: "size-13"
		}
	},
	defaultVariants: {
		size: "header"
	}
});

const logoWordmarkVariants = cva("", {
	variants: {
		size: {
			header: "text-wordmark",
			display: "text-display"
		},
		tone: {
			ink: "text-ink",
			light: "text-stamp-text"
		}
	},
	defaultVariants: {
		size: "header",
		tone: "ink"
	}
});

type LogoProps = VariantProps<typeof logoWordmarkVariants> & {
	className?: string;
};

export function Logo({ size, tone, className }: LogoProps) {
	return (
		<span className={cn("inline-flex items-center gap-2", className)}>
			<LogoIcon className={logoIconVariants({ size })} />
			<span className={logoWordmarkVariants({ size, tone })}>떼거지</span>
		</span>
	);
}
